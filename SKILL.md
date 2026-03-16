---
name: video-podcast-maker
description: Use when user provides a topic and wants an automated video podcast created - handles research, script writing, TTS audio synthesis, Remotion video creation, and final MP4 output with background music
author: Agents365-ai
category: Content Creation
version: 1.0.0
created: 2025-01-27
updated: 2026-03-15
bilibili: https://space.bilibili.com/441831884
github: https://github.com/Agents365-ai/video-podcast-maker
dependencies:
  - remotion-best-practices
metadata:
  openclaw:
    requires:
      env:
        - AZURE_SPEECH_KEY
        - AZURE_SPEECH_REGION
      bins:
        - python3
        - ffmpeg
        - node
        - npx
    primaryEnv: AZURE_SPEECH_KEY
    emoji: "🎬"
    homepage: https://github.com/Agents365-ai/video-podcast-maker
    os: ["macos", "linux"]
    install:
      - kind: brew
        formula: ffmpeg
        bins: [ffmpeg]
      - kind: uv
        package: edge-tts
        bins: [edge-tts]
---

> **REQUIRED: Load Remotion Best Practices First**
>
> This skill depends on `remotion-best-practices` (official Remotion best practices). **You MUST invoke it before proceeding:**
> ```
> Skill tool: skill="remotion-best-practices"
> ```

# Video Podcast Maker

## Quick Start

打开 Claude Code，直接说：**"帮我制作一个关于 [你的主题] 的 B站视频播客"**

---

## Auto Update Check

**Claude behavior:** 每次 skill 被调用时，自动检查是否有新版本：

```bash
timeout 5 git -C ~/.claude/skills/video-podcast-maker fetch --quiet 2>/dev/null || true
LOCAL=$(git -C ~/.claude/skills/video-podcast-maker rev-parse HEAD 2>/dev/null)
REMOTE=$(git -C ~/.claude/skills/video-podcast-maker rev-parse origin/main 2>/dev/null)
if [ -n "$LOCAL" ] && [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
  echo "UPDATE_AVAILABLE"
else
  echo "UP_TO_DATE"
fi
```

- **有更新时**：使用 AskUserQuestion 提示用户 "video-podcast-maker skill 有新版本可用，是否更新？"
  - **是（推荐）** → 执行 `git -C ~/.claude/skills/video-podcast-maker pull`
  - **否** → 继续使用当前版本
- **已是最新**：静默继续，不打扰用户

---

## Prerequisites (One-time Setup)

### 0.1 环境检查清单

| 工具 | 检查命令 | 安装 (macOS) |
|------|----------|--------------|
| Node.js 18+ | `node -v` | `brew install node` |
| Python 3.8+ | `python3 --version` | `brew install python3` |
| FFmpeg | `ffmpeg -version` | `brew install ffmpeg` |

### 0.2 API 密钥

```bash
# Azure Speech (必需) - 添加到 ~/.zshrc
export AZURE_SPEECH_KEY="your-azure-speech-key"
export AZURE_SPEECH_REGION="eastasia"

# 验证
echo $AZURE_SPEECH_KEY  # 应显示你的密钥
```

获取方式：[Azure 门户](https://portal.azure.com/) → 创建"语音服务"资源

### 0.3 Python 依赖

```bash
pip install azure-cognitiveservices-speech requests
```

### 0.4 Remotion 项目设置

```bash
# 创建 Remotion 项目（如已有则跳过）
npx create-video@latest my-video-project
cd my-video-project
npm i  # 安装依赖

# 验证
npx remotion studio  # 应打开浏览器预览
```

### 0.5 快速验证

```bash
# 一键检查所有依赖
echo "=== 环境检查 ===" && \
node -v && \
python3 --version && \
ffmpeg -version 2>&1 | head -1 && \
[ -n "$AZURE_SPEECH_KEY" ] && echo "✓ AZURE_SPEECH_KEY 已设置" || echo "✗ AZURE_SPEECH_KEY 未设置"
```

---

## Overview

Automated pipeline to create professional **Bilibili (B站) 横屏知识视频** from a topic.

> **目标平台：B站横屏视频 (16:9)**
> - 分辨率：3840×2160 (4K) 或 1920×1080 (1080p)
> - 风格：简约纯白（默认）

**技术栈：** Claude + Azure TTS + Remotion + FFmpeg

### 适用场景

| 适合 | 不适合 |
|------|--------|
| 知识科普视频 (横屏 16:9) | 直播录像 |
| 产品对比评测 | 真人出镜 |
| 教程讲解 | Vlog |
| 新闻资讯解读 | 音乐 MV |
| 竖屏精华片段 (9:16) | |

### 输出规格

| 参数 | 横屏 (16:9) | 竖屏 (9:16) |
|------|-------------|-------------|
| **分辨率** | 3840×2160 (4K) | 2160×3840 (4K) |
| **帧率** | 30 fps | 30 fps |
| **编码** | H.264, 16Mbps | H.264, 16Mbps |
| **音频** | AAC, 192kbps | AAC, 192kbps |
| **时长** | 1-15 分钟 | 60-90 秒 (精华片段) |

---

## Technical Rules

以下是视频制作的技术硬约束，其他视觉设计和布局由 Claude 根据内容自由发挥：

| Rule | Requirement |
|------|-------------|
| **Single Project** | All videos live under `videos/{name}/` in the user's Remotion project. NEVER create a new project/repo for each video. Remotion code, templates, and components are shared; only per-video assets (podcast.txt, audio, timing.json, output MP4) go in each subfolder. |
| **4K Output** | 3840×2160, use `scale(2)` wrapper over 1920×1080 design space |
| **Content Width** | ≥85% of screen width, no tiny centered boxes |
| **Bottom Safe Zone** | Bottom 100px reserved for subtitles |
| **Audio Sync** | All animations driven by `timing.json` timestamps |
| **Thumbnail** | Must generate both 16:9 (1920×1080) AND 4:3 (1200×900). Design for small-size visibility: title text ≥80px bold, icons/graphics as large as possible, high contrast colors, minimal elements. Thumbnails are viewed at ~300px wide in feed — if text isn't readable at that size, make it bigger. Default layout: title centered, all UI elements and text centered (both horizontally and vertically). |
| **Font** | PingFang SC / Noto Sans SC for Chinese text |

---

## Visual Design Minimums (MUST follow)

以下是防止文字过小、布局过空的**硬约束**（1080p 设计空间）：

| Constraint | Minimum |
|------------|---------|
| **Any text** | ≥ 18px |
| **Hero title** | ≥ 72px |
| **Section title** | ≥ 60px |
| **Card / body text** | ≥ 24px |
| **Section padding** | ≥ 40px |
| **Card padding** | ≥ 24px |

---

## Design Philosophy

Templates follow a **Marp-like clean slide aesthetic** — typography-first, solid colors, generous whitespace.
- **Typography-first hierarchy**: size, weight, and color differentiation drive visual structure
- **Solid backgrounds only**: pure white or flat colors — no gradients
- **Generous whitespace**: let content breathe with ample spacing between elements
- **Minimal borders**: `1px solid rgba(0,0,0,0.08)` when separation is needed, otherwise none
- **No shadows by default**: exception: CodeBlock keeps its dark terminal background
- **Color palette**: match the subject (tech → cool blues/grays, food → warm tones, finance → dark/gold)
- **Section layouts**: create new component arrangements, don't repeat the same layout for every section

**Anti-patterns (DO NOT use):**

| Anti-pattern | Reason |
|-------------|--------|
| `linear-gradient` on backgrounds | Use solid colors instead |
| `boxShadow` on cards/containers | Use 1px border or nothing |
| Decorative shapes (circles, blobs) | Typography provides hierarchy |
| `textShadow` | Clean text is sharper |
| `borderRadius > 16px` | Keep corners subtle (8-12px) |
| `drop-shadow` on icons | Icons render directly |

**What to keep consistent**: Technical Rules above (4K, safe zones, min sizes), component imports from `./components`, and the `timing.json`-driven timing system.

**What to vary freely**: colors, solid backgrounds, layout composition, typography scale, icon choices, spacing, animation timing, section visual identity.

## Quality Checklists (MUST follow)

### Per-Section Checklist

Claude MUST verify each section meets ALL of these before proceeding:

| # | Check | Requirement |
|---|-------|-------------|
| 1 | **Typographic hierarchy** | 2+ levels of size/weight/color differentiation |
| 2 | **Adjacent differentiation** | Differs from previous section in ≥2 of: background color, layout direction, content form |
| 3 | **Purposeful animation** | Entrance animation on primary content block; stagger on lists optional |
| 4 | **Generous whitespace** | ≤5 key points per section, generous spacing between elements |
| 5 | **Topic-matched colors** | Solid color palette (no gradients) serves the content (tech→cool blue, health→warm green, finance→dark blue/gold) |

### Video-Level Checklist (before render)

| # | Check | Requirement |
|---|-------|-------------|
| 1 | **Layout variety** | ≥3 different layout types across the video (centered, grid, split, timeline, etc.) |
| 2 | **Background alternation** | No 2 consecutive sections share the same background color; solid colors only |
| 3 | **Unified color scheme** | Primary/secondary/accent colors used consistently throughout |
| 4 | **Thumbnail readability** | Title text readable at ~300px thumbnail width |
| 5 | **Hero impact** | Large title (>=80px) with typographic contrast; clean solid background |

### TTS Quality Guidance

| Technique | How |
|-----------|-----|
| **Section pauses** | Add an empty line before each `[SECTION:xxx]` marker in podcast.txt for natural breathing room |
| **Pacing variation** | Slightly slower intro/outro (TTS_RATE="+0%"), normal middle sections (TTS_RATE="+5%") |
| **Key sentence emphasis** | Use SSML `<emphasis>` tags on important sentences (Azure backend supports this) |

## Visual Design Reference (recommended)

以下尺寸来自已验证的生产视频，作为推荐参考。Claude 可根据内容需要灵活调整，但不得低于上方 Minimums。

### Typography Scale (1080p design space)

| Element | Recommended Size | Weight | When to Use |
|---------|-----------------|--------|-------------|
| **Hero Title** | 72–120px | 800 | Opening section, brand moment |
| **Section Title** | 72–80px | 700–800 | Each section's main heading |
| **Large Emphasis** | 40–68px | 600–700 | Key statements, conclusions, quotes |
| **Subtitle / Description** | 30–40px | 500–600 | Under section titles, subheadings |
| **Card Title** | 34–38px | 700 | Feature cards, list group headers |
| **Body Text** | 26–34px | 500–600 | Paragraphs, list items, descriptions |
| **Tags / Pills** | 20–26px | 600 | Labels, badges, categories |

### Layout Patterns (recommended)

| Pattern | Recommended |
|---------|-------------|
| **Card** | `borderRadius: 8–12px`, `border: 1px solid rgba(0,0,0,0.08)`, no shadow |
| **Section Padding** | `60–100px` (generous whitespace) |
| **Grid Gap** | `24–40px` |
| **Hero / Impact** | Typography-only impact, generous whitespace, no decorative elements |
| **Content Max Width** | 800–950px for centered blocks, or full width with padding |

> **Principle:** 这些是经过验证的参考值，不是强制规格。不同视频风格（科技/教育/新闻）可以有不同的视觉表现，只要不低于 Minimums。

---

## 文件路径与命名规范

### 目录结构

```
project-root/                           # Remotion 项目根目录
├── src/remotion/                       # Remotion 源码
│   ├── compositions/                   # 视频 Composition 定义
│   ├── Root.tsx                        # Remotion 入口
│   └── index.ts                        # 导出
│
├── public/media/{video-name}/          # 素材目录 (Remotion staticFile() 可访问)
│   ├── research/                      # Step 2 研究阶段收集的原始素材
│   │   └── {descriptive_name}.{ext}  # 按内容命名
│   ├── {section}_{index}.{ext}         # 通用素材 (Step 3 整理后提升到顶层)
│   ├── {section}_screenshot.png        # 网页截图
│   ├── {section}_logo.png              # Logo
│   ├── {section}_web_{index}.{ext}     # 网络图片
│   └── {section}_ai.png                # AI 生成图片
│
├── videos/{video-name}/                # 视频项目资产 (非 Remotion 代码)
│   ├── topic_definition.md             # Step 1: 主题定义
│   ├── research/                       # Step 2: 研究资料 (多文件)
│   │   ├── _index.md                  # 研究索引与摘要 (含已收集素材清单)
│   │   └── research_*.md             # 按维度分类的研究文件 (含 inline 素材标注)
│   ├── media_manifest.json             # Step 3: 素材清单 (研究收集+补全+AI生成)
│   ├── section_outline.md              # Step 4: 章节大纲
│   ├── section_density.md              # Step 4: 密度分析
│   ├── section_ui.md                   # Step 4: UI 设计文档 (含素材引用+布局草图)
│   ├── podcast.txt                     # Step 5: 旁白脚本
│   ├── publish_info.md                 # Step 6+13: 发布信息
│   ├── podcast_audio.wav               # Step 8: TTS 音频
│   ├── podcast_audio.srt               # Step 8: 字幕文件
│   ├── timing.json                     # Step 8: 时间轴
│   ├── thumbnail_*.png                 # Step 7: 封面
│   ├── output.mp4                      # Step 10: Remotion 输出
│   ├── video_with_bgm.mp4              # Step 11: 添加 BGM
│   ├── final_video.mp4                 # Step 12: 最终输出
│   └── bgm.mp3                         # 背景音乐
│
└── remotion.config.ts                  # Remotion 配置
```

> ⚠️ **重要**: Remotion 渲染时必须指定完整输出路径，否则默认输出到 `out/`:
> ```bash
> npx remotion render src/remotion/index.ts CompositionId videos/{name}/output.mp4
> ```

### 命名规则

**视频名称 `{video-name}`**: 全小写英文，连字符分隔（如 `reference-manager-comparison`）

**章节名称 `{section}`**: 全小写英文，下划线分隔，与 `[SECTION:xxx]` 一致

**缩略图命名** (⚠️ 16:9 和 4:3 **都是必须的**，B站不同位置使用不同比例):
| 类型 | 16:9 (播放页横版) | 4:3 (推荐流/动态竖版) |
|------|------|-----|
| Remotion | `thumbnail_remotion_16x9.png` | `thumbnail_remotion_4x3.png` |
| AI | `thumbnail_ai_16x9.png` | `thumbnail_ai_4x3.png` |

### 渲染前后文件操作

```bash
# 渲染前
cp videos/{name}/podcast_audio.wav videos/{name}/timing.json public/
[ -f videos/{name}/media_manifest.json ] && cp videos/{name}/media_manifest.json public/

# 渲染后清理
rm -f public/podcast_audio.wav public/timing.json public/media_manifest.json
rm -rf public/media/{name}
```

---

## Workflow

### Phase Routing

工作流分为 3 个阶段，按顺序执行。每个阶段完成后，读取下一个阶段的文件继续。

| Phase | File | Steps | Description |
|-------|------|-------|-------------|
| **Phase 1: Planning** | `SKILL_phase1_planning.md` | 1-4 | 主题定义、深度调研、素材整理与补全、Video PRD 设计 |
| **Phase 2: Production** | `SKILL_phase2_production.md` | 5-8 | 脚本写作、发布信息、封面、TTS |
| **Phase 3: Video** | `SKILL_phase3_video.md` | 9-15 | Remotion 组合、渲染、BGM、字幕、验证、清理 |

**Claude behavior:** 开始制作视频时，读取 `SKILL_phase1_planning.md` 启动 Phase 1。每个阶段文件末尾有指向下一阶段的引用。

### Progress Tracking

在 Step 1 开始时，使用 `TaskCreate` **按以下列表逐条创建 tasks**（不要合并或省略），每步开始时 `TaskUpdate` 为 `in_progress`，完成后标记 `completed`：

```
 1. Define topic direction (brainstorming) → topic_definition.md
 2a. Research Round 1 (breadth) + opportunistic media collection → research/*.md
 2b. Brainstorm with user → confirm/expand research
 2c. Research Round 2-3 (depth + verify) → research/_index.md
 3a. Scan research media + gap analysis → 素材清点 + 缺口分析
 3b. Search/AI-generate to fill gaps → media_manifest.json
 4a. Chapter Blueprint → section_outline.md (draft)
 4b. Per-section interactive design (with asset refs + storyboards)
 4c. Global style + output documents → section_outline.md, section_density.md, section_ui.md
 5a. Read PRDs + write narration script → podcast.txt (draft)
 5b. Dry-run + iterate word budgets → podcast.txt (final)
 6. Generate publish info (Part 1) → publish_info.md
 7. Generate thumbnails (16:9 + 4:3) → thumbnail_*.png
 8. Generate TTS audio + validate → podcast_audio.wav, timing.json
 9a. Read PRDs + map components → Video.tsx, Root.tsx
 9b. Studio preview + iterative refinement
10. Render 4K video → output.mp4
11. Mix background music → video_with_bgm.mp4
12. Add subtitles (optional) → final_video.mp4
13. Complete publish info (Part 2) → chapter timestamps
14. Verify output (resolution, sync, files)
15. Cleanup temp files (optional)
```

### Validation Checkpoints

**After Step 3 (Media Consolidation)**: Verify `media_manifest.json` covers all suggested sections from `research/_index.md`.

**After Step 8 (TTS)**: See Post-TTS 验证清单 in Step 8 (6-point checklist).

**After Step 10 (Render)**:
- [ ] `output.mp4` resolution is 3840x2160
- [ ] Audio-video sync verified
- [ ] No black frames

**After Step 12 (Final)**:
- [ ] `final_video.mp4` resolution is 3840x2160
- [ ] Subtitles display correctly (if added)
- [ ] File size is reasonable

---

## Background Music Options

Available at `~/.claude/skills/video-podcast-maker/assets/`:
- `perfect-beauty-191271.mp3` - Upbeat, positive
- `snow-stevekaldes-piano-397491.mp3` - Calm piano

---

## Troubleshooting (常见问题)

### TTS: Azure API 密钥错误

**症状**: `Error: Authentication failed`, `HTTP 401 Unauthorized`

**解决方案**:
```bash
# 检查环境变量
echo $AZURE_SPEECH_KEY
echo $AZURE_SPEECH_REGION

# 设置环境变量
export AZURE_SPEECH_KEY="your-key-here"
export AZURE_SPEECH_REGION="eastasia"
```

---

### FFmpeg: BGM 混音问题

**症状**: BGM 音量过大盖住人声，BGM 结尾突然中断

**解决方案**:
```bash
# 基础混音（人声为主，BGM 降低）
ffmpeg -i voice.mp3 -i bgm.mp3 \
  -filter_complex "[0:a]volume=1.0[voice];[1:a]volume=0.15[bgm];[voice][bgm]amix=inputs=2:duration=first" \
  -ac 2 output.mp3

# 带淡入淡出的混音
ffmpeg -i voice.mp3 -i bgm.mp3 \
  -filter_complex "
    [0:a]volume=1.0[voice];
    [1:a]volume=0.15,afade=t=in:st=0:d=2,afade=t=out:st=58:d=2[bgm];
    [voice][bgm]amix=inputs=2:duration=first
  " output.mp3
```

---

### 快速检查清单

**渲染前检查**:
- [ ] 所有素材文件存在
- [ ] timing.json 格式正确
- [ ] 音频时长与 timing 匹配
- [ ] 环境变量已设置
- [ ] 磁盘空间充足 (>20GB for 4K)

**渲染后检查**:
- [ ] 视频时长正确
- [ ] 音画同步
- [ ] 字幕显示正常
- [ ] 无黑屏/空白帧
