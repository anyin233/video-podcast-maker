# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language

Write all code, comments, commit messages, and documentation in English. Exception: `README.md` (Chinese documentation, default for GitHub display).

## Git Commits

Do NOT add "Co-Authored-By: Claude" to commit messages.

## What This Is

A Claude Code skill for automated video podcast creation targeting **B站横屏视频 (16:9)** with optional **竖屏精华片段 (9:16)**. The 15-step workflow is defined in `SKILL.md`.

## Key Commands

```bash
# TTS audio generation (3 backends)
python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name}                    # Azure (default)
TTS_BACKEND=cosyvoice python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name}  # CosyVoice
TTS_BACKEND=edge python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name}       # Edge TTS (free)

# TTS utilities
python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name} --dry-run   # Estimate duration, no API call
python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name} --resume    # Skip already-synthesized parts
TTS_RATE="+15%" python3 generate_tts.py ...                                                      # Control speech rate

# Remotion (default: H.265 + hardware acceleration)
npx remotion studio src/remotion/index.ts                                                         # Preview (always use before render)
npx remotion render src/remotion/index.ts CompositionId videos/{name}/output.mp4 --codec h265 --video-bitrate 16M --hardware-acceleration if-possible  # 4K HEVC render
npx remotion render src/remotion/index.ts CompositionId videos/{name}/preview.mp4 --codec h265 --scale 0.33 --crf 28  # Quick 720p preview
npx remotion still src/remotion/index.ts Thumbnail16x9 videos/{name}/thumbnail_remotion_16x9.png  # Thumbnail
npx remotion render src/remotion/index.ts MyVideoVertical videos/{name}/output_vertical.mp4 --codec h265 --video-bitrate 16M --hardware-acceleration if-possible  # Vertical 9:16
npx remotion still src/remotion/index.ts Thumbnail9x16 videos/{name}/thumbnail_remotion_9x16.png  # Vertical thumbnail

# Post-processing (FFmpeg)
ffmpeg -y -i videos/{name}/output.mp4 -stream_loop -1 -i videos/{name}/bgm.mp3 \
  -filter_complex "[0:a]volume=1.0[a1];[1:a]volume=0.05[a2];[a1][a2]amix=inputs=2:duration=first[aout]" \
  -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k videos/{name}/video_with_bgm.mp4

# Subtitle burn-in (macOS hardware acceleration)
ffmpeg -y -i videos/{name}/video_with_bgm.mp4 \
  -vf "subtitles=videos/{name}/podcast_audio.srt:force_style='FontName=PingFang SC,FontSize=14,PrimaryColour=&H00333333,OutlineColour=&H00FFFFFF,Bold=1,Outline=2'" \
  -c:v hevc_videotoolbox -q:v 55 -tag:v hvc1 -s 3840x2160 -c:a copy videos/{name}/final_video.mp4
# Fallback (no hardware acceleration): -c:v libx265 -crf 18 -preset slow -tag:v hvc1
```

## Architecture

```
generate_tts.py                  # TTS (Azure/CosyVoice/Edge) + SRT + timing.json
SKILL.md                         # 15-step workflow documentation
templates/
  Video.tsx                      # Main composition — section renderer + audio + transitions
  Root.tsx                       # Remotion root, Zod schema for Studio props
  Thumbnail.tsx                  # Cover image component (16:9 + 4:3 + 9:16)
  podcast.txt                    # Script template with [SECTION:xxx] markers
  components/                    # Reusable visual building blocks
    index.ts                     # Barrel export
    layouts.tsx                  # Scale4K, FullBleedLayout, PaddedLayout
    animations.tsx               # useEntrance, useExit, useCounter, useBarFill, getPresentation
    ComparisonCard.tsx           # Two-column VS layout, clean borders
    Timeline.tsx                 # Vertical timeline with solid nodes
    CodeBlock.tsx                # Dark terminal code display
    QuoteBlock.tsx               # Left-bordered quote block
    FeatureGrid.tsx              # 2-3 column icon grid, minimal borders
    DataBar.tsx                  # Animated horizontal bar chart
    StatCounter.tsx              # Animated number tickers
    FlowChart.tsx                # Horizontal arrow-connected steps
    IconCard.tsx                 # Large icon emphasis card
    ChapterProgressBar.tsx       # Minimal 4px progress line (renders outside Scale4K)
  section-templates/             # 12 section layout templates (each requires ≥1 image)
    templates.tsx                # All 12 template components
    Showcase.tsx                 # Demo compositions with sample data
    index.ts                     # Barrel export
assets/                          # BGM tracks, bilibili triple-click animations
```

### Section Templates (12 layouts)

Every section MUST use one of these templates. Each template requires at least one image (except T13 which takes a video file).

| ID | Name | Layout | Use Case |
|----|------|--------|----------|
| T01 | HeroSplit | 60/40 left text + right image | Opening, topic intro |
| T02 | PhotoOverlay | Full-bleed image + text overlay | Atmosphere, dramatic opening |
| T03 | ImageGrid | 2×2 horizontal cards (left image + right text) | Multi-feature showcase |
| T04 | QuotePortrait | Decorative quote + circular portrait | Expert quotes, opinions |
| T05 | SplitDataViz | Data bars left + image right | Data comparison with visual context |
| T06 | TimelineMedia | Vertical timeline with thumbnails + side image | Milestones, history |
| T07 | MagazineSpread | Large image left + bullet content right | Deep content, editorial |
| T08 | StepByStep | Large circular images + numbered steps + metrics | Process, methodology |
| T09 | BigNumber | Giant stat over muted background image | Key statistics, impact |
| T10 | DualCompare | Side-by-side with image headers + stats + verdict | A vs B comparison |
| T11 | FeaturedImage | Single hero image with elegant frame | Image showcase ONLY |
| T12 | BannerCards | Top banner image + rich info cards below | Dashboard, market overview |
| T13 | FullVideo | Full-screen video playback | Video clips, demos, B-roll |

### Data Flow

```
podcast.txt → generate_tts.py → podcast_audio.wav + podcast_audio.srt + timing.json
                                        ↓
                              copy to public/ directory
                                        ↓
                    Video.tsx reads timing.json → drives <TransitionSeries> timing
                                        ↓
                         npx remotion render → 4K MP4 (3840×2160)
                                        ↓
                         FFmpeg: mix BGM → burn subtitles → final_video.mp4
```

### generate_tts.py Internals

- **Backend dispatch**: `synth_azure()`, `synth_cosyvoice()`, `synth_edge()` — each returns `(part_files, word_boundaries, accumulated_duration)`
- **Phoneme system** (3-tier priority): inline markers `执行器[zhí xíng qì]` > project `phonemes.json` > built-in `BUILTIN_POLYPHONES` dict
- **Section matching**: sliding-window algorithm matches `[SECTION:xxx]` first_text against word_boundaries to compute precise timestamps
- **Resume**: `--resume` skips parts where `part_{i}.wav` already exists, uses ffprobe for duration
- **Output**: chunks text into ≤400 char segments, synthesizes each, merges with ffmpeg concat

### Template Architecture

- `Video.tsx` imports components via barrel `./components` — only SectionComponent switch cases and main composition logic live here
- `Root.tsx` defines Zod schema for all Studio-editable props (colors, typography, transitions, progress bar, orientation)
- `Root.tsx` registers `MyVideo` (3840x2160) and `MyVideoVertical` (2160x3840) compositions
- `ProgressBar` (4px line) renders **outside** the `Scale4K` wrapper at native 4K resolution
- `TransitionSeries` compensates for overlap by adding lost frames to the first section
- All components are orientation-aware via `props.orientation` — vertical mode adapts layouts, font sizes, and spacing

## Critical Rules

- **Always 4K output** — horizontal 3840×2160, vertical 2160×3840 — use `transform: scale(2)` wrapper in Remotion
- **Use `npx remotion studio` for preview** — real-time debugging before final render
- **Silent sections** (`[SECTION:outro]` with empty content) get `is_silent: true` — Remotion adds 150 extra frames
- **Section markers** in `podcast.txt` must match Remotion component names exactly
- **Content width** ≥85% of screen, bottom 100px reserved for subtitles
- **Visual minimums** (MUST): hero ≥72px, section ≥60px, body ≥24px, any text ≥18px

## Environment Variables

```bash
export AZURE_SPEECH_KEY="..."      # Required for Azure TTS (default backend)
export AZURE_SPEECH_REGION="eastasia"
export DASHSCOPE_API_KEY="..."     # Required for CosyVoice TTS + AI thumbnails (imagenty)
export TTS_BACKEND="azure"         # Or "cosyvoice" or "edge" (free, no key needed)
export GEMINI_API_KEY="..."        # Optional: AI thumbnails (imagen)
export EDGE_TTS_VOICE="zh-CN-XiaoxiaoNeural"  # Optional: Edge TTS voice override
```

## Design Context

### Users
B站 (Bilibili) viewers aged 16-30 who consume knowledge/culture commentary videos. They're scrolling feeds on mobile or watching on desktop, expecting visually polished content that matches top-tier B站 UP主 quality. The job: learn something interesting in 5 minutes while being entertained.

### Brand Personality
**Lively, Bold, Fast-paced** — like a witty friend who explains internet culture with energy and confidence. Not academic, not boring, not try-hard.

### Aesthetic Direction
- **Visual tone**: Typography-first Marp-like slides with solid color backgrounds. Clean but not sterile — warm colors and generous whitespace keep it approachable.
- **References**: Top B站 knowledge UP主 video quality, Marp presentation aesthetic
- **Anti-references**: Generic AI slideshow look, gradient-heavy corporate decks, cluttered infographic style
- **Theme**: Light mode only, warm palette per topic (this video: peach/orange for cat/cute theme)

### Design Principles
1. **Typography drives hierarchy** — Size, weight, and color differentiation create structure. No decorative elements needed.
2. **Solid colors, no shortcuts** — Pure flat backgrounds. No gradients, no shadows, no blur effects.
3. **Generous breathing room** — Content ≤5 key points per section. White space is a feature, not waste.
4. **Every section feels different** — Adjacent sections must differ in ≥2 of: background, layout direction, content form.
5. **Bold but readable** — Large text (≥72px titles), high contrast, readable at any screen size.

## Troubleshooting

- TTS errors: check `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` env vars
- Remotion black screen: verify `timing.json` exists in `public/` and has correct `start_frame`/`duration_frames`
- Blurry output: ensure 4K render (3840×2160) with `scale(2)` wrapper
- FFmpeg subtitle encoding: use UTF-8 for SRT files
- Edge TTS no audio: check network connectivity (uses Microsoft Edge's online TTS)
