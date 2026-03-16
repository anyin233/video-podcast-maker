# Media Collection Workflow Optimization Design

**Date:** 2026-03-15
**Status:** Implemented

## Problem

Media asset collection happened at Step 5 (Phase 2), after the PRD was finalized. The PRD (`section_ui.md`) only described component types, and Claude retroactively figured out which sections needed assets. This caused a disconnect between design intent and available assets.

## Solution

Move media discovery/generation earlier — to the research phase — so the PRD references concrete assets with visual storyboards.

## Changes

### Step 2 (Research): Opportunistic Media Collection

During research, Claude collects relevant images/screenshots/charts as it encounters them:
- Downloads to `public/media/{video-name}/research/`
- Inline annotation in research files: `→ 素材已保存 \`research/filename.jpg\` (来源: xxx, 用途: xxx)`
- `_index.md` gains `## 已收集素材` summary table
- Collection types: evidence, aesthetic references, ready-to-use assets
- Exclusion: only low-res (<720px) and heavily watermarked images

### New Step 3: Media Consolidation

After research, before PRD:
1. **Scan** all `research_*.md` for `→ 素材已保存` annotations
2. **Gap analysis** per suggested chapter (checkmark/warning/cross status)
3. **Fill gaps** via web search + AI generation (batch approval from user)
4. **Output** `media_manifest.json` with all assets, IDs, sources, suggested sections

### Step 4 (was Step 3): PRD with Asset References

`section_ui.md` gains per-section:
- `#### 素材引用` table (asset ID, filename, usage)
- `#### 布局草图` ASCII layout showing asset placement
- Design cards include `🖼️ 素材引用` and `📐 布局草图` fields

### Old Step 5 (Collect Media Assets): Removed

Absorbed into new Step 3.

### Step Renumbering

| Old | New | Content |
|-----|-----|---------|
| 1 | 1 | Topic Definition |
| 2 | 2 | Research (+ opportunistic media) |
| — | 3 | Media Consolidation (NEW) |
| 3 | 4 | Video PRD (+ asset refs) |
| 4 | 5 | Script Writing |
| 5 | — | Media Collection (REMOVED) |
| 6 | 6 | Publish Info |
| 7 | 7 | Thumbnails |
| 8 | 8 | TTS |
| 9-15 | 9-15 | Unchanged |

## Files Modified

- `SKILL.md` — Phase table, progress tracking, directory structure
- `SKILL_phase1_planning.md` — Step 2 media behavior, new Step 3, Step 4 format
- `SKILL_phase2_production.md` — Removed Step 5, renumbered Step 4→5
