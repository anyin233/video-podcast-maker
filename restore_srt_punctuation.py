#!/usr/bin/env python3
"""Restore punctuation to SRT subtitles by incremental alignment with source text.

Walks through source text and SRT entries character-by-character, collecting
basic punctuation (，。！？、：；) that falls between matched characters.

Rules:
- Periods (。！？) at sentence ends are preserved
- Commas (，) and other pause marks (、：；) are preserved
- Commas are added at artificial break points where no punctuation exists
- Quotes, book marks, em dashes, and non-Chinese chars are skipped
"""
import re
import sys


# Only these basic punctuation marks are restored into subtitles
INCLUDE_PUNCT = set("，。！？、：；")
# These are skipped during alignment (don't include in subtitle text)
SKIP_CHARS = set('""''《》「」——…\n\r\t ')


def parse_srt(path):
    """Parse SRT file into list of {idx, timing, text} dicts."""
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    entries = []
    for block in re.split(r"\n\n+", content.strip()):
        lines = block.strip().split("\n")
        if len(lines) >= 3:
            entries.append({
                "idx": int(lines[0]),
                "timing": lines[1],
                "text": "\n".join(lines[2:]),
            })
    return entries


def clean_source(podcast_path):
    """Read podcast.txt and return clean text (section markers + phonemes removed)."""
    with open(podcast_path, "r", encoding="utf-8") as f:
        text = f.read().strip()

    # Remove section markers
    text = re.sub(r"\[SECTION:\w+\]", "", text).strip()
    # Remove inline phoneme markers: 执行器[zhí xíng qì] -> 执行器
    text = re.sub(
        r"([\u4e00-\u9fff]+)\[([a-zA-Z\u0101\u00e1\u01ce\u00e0\u0113\u00e9\u011b\u00e8"
        r"\u012b\u00ed\u01d0\u00ec\u014d\u00f3\u01d2\u00f2\u016b\u00fa\u01d4\u00f9"
        r"\u01d6\u01d8\u01da\u01dc\u00fc\s]+)\]",
        r"\1", text)
    # Remove pronunciation hints
    text = re.sub(
        r'([A-Za-z0-9\-]+)\uff0c\u8bfb\u4f5c["\u201c\u201d]'
        r'([\u4e00-\u9fff]+)["\u201c\u201d]',
        r"\2", text)
    return text


def align_entry(source, src_pos, entry_text):
    """Align one SRT entry to source text, collecting punctuation.

    Walks through source from src_pos, matching each character in entry_text.
    Includes INCLUDE_PUNCT chars encountered between matches. Skips SKIP_CHARS
    and any other non-matching chars (e.g. Japanese characters).

    Returns: (restored_text, new_src_pos)
    """
    result = []
    chars = list(entry_text)
    ci = 0

    while ci < len(chars) and src_pos < len(source):
        sc = source[src_pos]

        if sc == chars[ci]:
            # Character match
            result.append(sc)
            ci += 1
            src_pos += 1
        elif sc in INCLUDE_PUNCT:
            # Basic punctuation — include in result
            result.append(sc)
            src_pos += 1
        else:
            # Everything else (quotes, brackets, Japanese, whitespace) — skip
            src_pos += 1

    # Consume trailing punctuation that belongs to this entry
    while src_pos < len(source):
        sc = source[src_pos]
        if sc in INCLUDE_PUNCT:
            result.append(sc)
            src_pos += 1
        elif sc in SKIP_CHARS:
            src_pos += 1
        else:
            break

    return "".join(result), src_pos


def restore_punctuation(srt_path, podcast_path, output_path):
    """Align SRT entries with source text and restore punctuation."""
    entries = parse_srt(srt_path)
    source = clean_source(podcast_path)

    src_pos = 0
    new_entries = []

    for entry in entries:
        restored, src_pos = align_entry(source, src_pos, entry["text"])
        new_entry = dict(entry)
        if restored:
            # Strip leading punctuation (subtitle shouldn't start with comma etc.)
            restored = re.sub(r"^[，。！？、：；]+", "", restored)
            new_entry["text"] = restored or entry["text"]
        new_entries.append(new_entry)

    # Post-process: add comma at break points without trailing punctuation
    for i, entry in enumerate(new_entries):
        text = entry["text"]
        if not text:
            continue
        is_last = i == len(new_entries) - 1
        if not is_last and text[-1] not in INCLUDE_PUNCT:
            entry["text"] = text + "，"

    # Remove trailing comma from last entry (no continuation)
    if new_entries and new_entries[-1]["text"].endswith("，"):
        new_entries[-1]["text"] = new_entries[-1]["text"][:-1]

    # Write output SRT
    with open(output_path, "w", encoding="utf-8") as f:
        for i, entry in enumerate(new_entries, 1):
            f.write(f"{i}\n{entry['timing']}\n{entry['text']}\n\n")

    print(f"Generated {len(new_entries)} subtitle entries with punctuation -> {output_path}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} <srt_file> <podcast.txt> [output.srt]")
        sys.exit(1)

    srt_file = sys.argv[1]
    podcast_file = sys.argv[2]
    output_file = sys.argv[3] if len(sys.argv) > 3 else srt_file

    restore_punctuation(srt_file, podcast_file, output_file)
