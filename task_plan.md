# 4chan Meme进化论 — Task Plan (Restructured)

## Goal
重构视频为~60个section，满足SKILL.md pacing要求：每页最多20秒，平均10秒/页。

## Constraint (from SKILL.md)
- 每页最多展示 20 秒，平均 10 秒/页
- 单页旁白上限 ~80 字，平均 ~40 字
- 章节数 ≈ 总时长(s) ÷ 10 ≈ 60

## Current State
- 28 images downloaded ✅
- TTS audio exists but needs regeneration (section markers will change)
- Video.tsx needs complete rewrite for ~60 sections

## Phases

### Phase A: Rewrite podcast.txt — NOT STARTED
- [ ] Split 15 content sections into ~60 sub-sections
- [ ] Each sub-section: 30-60 Chinese chars narration
- [ ] Validate with dry-run TTS (every section <20s, avg ~10s)

### Phase B: Regenerate TTS — NOT STARTED
- [ ] Generate TTS with Edge backend
- [ ] Merge parts into podcast_audio.wav
- [ ] Copy timing.json + audio to public/
- [ ] Verify: all sections <20s, average ~10s

### Phase C: Rewrite Video.tsx — NOT STARTED
- [ ] Map ~60 sections to templates (vary adjacent sections)
- [ ] Reuse 28 images across templates (each image ~2 uses avg)
- [ ] Per-family color palettes maintained
- [ ] No two adjacent sections use same template

### Phase D: Preview & Verify — NOT STARTED
- [ ] Studio preview, check sync
- [ ] Verify pacing feels right
- [ ] Fix any visual issues

## Section Split Plan (15 → ~60)

| Original Section | Duration | Split Into | Target/section |
|-----------------|----------|-----------|---------------|
| hero (21s) | 21s | 2 | ~10s |
| what_is_4chan (58s) | 58s | 6 | ~10s |
| wojak_origin (39s) | 39s | 4 | ~10s |
| wojak_oomers (37.6s) | 37.6s | 4 | ~10s |
| wojak_soyjak (33.7s) | 33.7s | 3 | ~11s |
| wojak_npc (29.2s) | 29.2s | 3 | ~10s |
| pepe_origin (57.2s) | 57.2s | 6 | ~10s |
| pepe_variants (34.6s) | 34.6s | 4 | ~9s |
| pepe_war (35.2s) | 35.2s | 3 | ~12s |
| chad_virgin (36.9s) | 36.9s | 4 | ~9s |
| chad_gigachad (55.5s) | 55.5s | 5 | ~11s |
| chad_yes (33.7s) | 33.7s | 3 | ~11s |
| greentext_intro (36.6s) | 36.6s | 4 | ~9s |
| greentext_classics (37.4s) | 37.4s | 4 | ~9s |
| summary (58.3s) | 58.3s | 6 | ~10s |
| outro (0s) | 0s | 1 | silent |
| **Total** | **603.9s** | **~62** | **~10s avg** |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| Section names with hyphens not parsed | 1 | Changed to underscores (regex \w+) |
| podcast_audio.wav not created by bg task | 1 | Manual ffmpeg concat merge |
| All transitions compensated on hero only | 1 | Distributed evenly across all sections |
