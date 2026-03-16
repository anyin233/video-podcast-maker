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
| FFmpeg (含 HEVC) | `ffmpeg -version` | `brew install ffmpeg` |

### 0.1.1 硬件加速检测

渲染前必须检测本地硬件加速支持，以选择最优 HEVC 编码器：

```bash
echo "=== 硬件加速检测 ==="
OS=$(uname -s)
if [ "$OS" = "Darwin" ]; then
  # macOS: VideoToolbox
  if ffmpeg -hide_banner -encoders 2>/dev/null | grep -q hevc_videotoolbox; then
    echo "✓ macOS VideoToolbox HEVC 硬件加速可用"
    echo "  Remotion: --hardware-acceleration if-possible"
    echo "  FFmpeg encoder: hevc_videotoolbox"
    HWACCEL_ENCODER="hevc_videotoolbox"
  else
    echo "⚠ VideoToolbox 不可用，将使用软件编码 (libx265)"
    HWACCEL_ENCODER="libx265"
  fi
elif [ "$OS" = "Linux" ]; then
  # Linux: NVENC (NVIDIA) > VAAPI (AMD/Intel)
  if ffmpeg -hide_banner -encoders 2>/dev/null | grep -q hevc_nvenc; then
    echo "✓ NVIDIA NVENC HEVC 硬件加速可用"
    HWACCEL_ENCODER="hevc_nvenc"
  elif ffmpeg -hide_banner -encoders 2>/dev/null | grep -q hevc_vaapi; then
    echo "✓ VAAPI HEVC 硬件加速可用"
    HWACCEL_ENCODER="hevc_vaapi"
  else
    echo "⚠ 无硬件加速，将使用软件编码 (libx265)"
    HWACCEL_ENCODER="libx265"
  fi
else
  echo "⚠ 未知平台，将使用软件编码 (libx265)"
  HWACCEL_ENCODER="libx265"
fi
echo "HEVC Encoder: $HWACCEL_ENCODER"
```

**Claude behavior:** 在 Step 10 渲染前自动执行此检测脚本，并根据结果选择 FFmpeg 编码器参数。Remotion 渲染始终使用 `--codec h265 --hardware-acceleration if-possible`（Remotion 自行判断硬件能力），FFmpeg 后处理步骤（字幕烧录等）则使用检测到的 `$HWACCEL_ENCODER`。

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
(ffmpeg -hide_banner -encoders 2>/dev/null | grep -q hevc && echo "✓ HEVC 编码支持可用" || echo "⚠ HEVC 编码不可用") && \
(ffmpeg -hide_banner -encoders 2>/dev/null | grep -qE "hevc_videotoolbox|hevc_nvenc|hevc_vaapi" && echo "✓ HEVC 硬件加速可用" || echo "⚠ HEVC 硬件加速不可用 (将使用 libx265 软件编码)") && \
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
| **编码** | H.265 (HEVC), 16Mbps | H.265 (HEVC), 16Mbps |
| **硬件加速** | 自动检测 (macOS VideoToolbox) | 自动检测 |
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

Templates follow a **Marp-like clean slide aesthetic** — typography-first, solid colors, generous whitespace, **every section must include at least one image** (except T13 FullVideo which takes a video file).
- **Image-required**: every section uses one of the 13 section templates, each requiring ≥1 image (AI-generated or real), except T13 which uses a video file
- **Typography-first hierarchy**: size, weight, and color differentiation drive visual structure
- **Solid backgrounds only**: pure white or flat colors — no gradients (exception: functional overlays on images for readability)
- **Content-rich but readable**: high information density while maintaining clear hierarchy
- **Generous whitespace**: let content breathe with ample spacing between elements
- **Minimal borders**: `1px solid rgba(0,0,0,0.08)` when separation is needed, otherwise none
- **No shadows by default**: exception: CodeBlock keeps its dark terminal background
- **Color palette**: match the subject (tech → cool blues/grays, food → warm tones, finance → dark/gold)
- **Section layouts**: select from 12 section templates; adjacent sections must use different templates

### Section Templates (13 layouts)

每个章节 MUST 从以下 13 个模板中选择。模板定义在 `templates/section-templates/templates.tsx`。

| ID | Name | Layout | Use Case |
|----|------|--------|----------|
| T01 | HeroSplit | 60/40 左文右图 | 开场、主题引入 |
| T02 | PhotoOverlay | 全屏背景图+文字叠层 | 氛围渲染、戏剧性开场 |
| T03 | ImageGrid | 2×2 横向图文卡片 | 多特性展示、案例集锦 |
| T04 | QuotePortrait | 引用+圆形头像 | 名言、专家观点 |
| T05 | SplitDataViz | 左数据条+右图片 | 数据对比+视觉支撑 |
| T06 | TimelineMedia | 带缩略图的时间线+侧图 | 发展历程、里程碑 |
| T07 | MagazineSpread | 大图左+要点列表右 | 深度内容、杂志风 |
| T08 | StepByStep | 大圆图+编号步骤+指标 | 流程、方法论 |
| T09 | BigNumber | 暗色背景图+巨型数字 | 关键统计、冲击力数据 |
| T10 | DualCompare | 双图双列+统计+结论 | A vs B 对比 |
| T11 | FeaturedImage | 单张大图居中展示 | 仅用于图片展示场景 |
| T12 | BannerCards | 顶部横幅图+详细卡片 | 数据仪表盘、市场概览 |
| T13 | FullVideo | 全屏视频播放 | 视频片段、产品演示、B-roll |

**模板选择规则：**
- 相邻章节不得使用相同模板
- T11 仅用于需要展示产品截图、示意图、照片的场景，不用于文字内容章节
- T13 为可选模板，需用户明确要求使用视频素材时才启用；使用 T13 需在 Step 3 中完成视频素材收集/生成
- 除 T13 外，每个模板都需要至少一张图片（通过 `media_manifest.json` 中的素材或 AI 生成）

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
│   ├── {section}_ai.png                # AI 生成图片
│   └── {section}_video.mp4             # 视频素材 (T13, optional)
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

## Workflow State & Resume

**Claude behavior:** Automatically persist workflow progress for error recovery.

### State File

Each video project maintains `videos/{name}/workflow_state.json`:

```json
{
  "video_name": "ai-agents-explained",
  "mode": "auto",
  "started_at": "2026-03-16T10:30:00",
  "current_step": 8,
  "steps": {
    "1": { "status": "completed", "completed_at": "2026-03-16T10:31:00" },
    "2": { "status": "completed", "completed_at": "2026-03-16T10:35:00" },
    "8": { "status": "failed", "error": "AZURE_SPEECH_KEY not set" }
  }
}
```

### Auto-Resume

**Claude behavior:** When the skill is invoked:

1. Check if `videos/*/workflow_state.json` exists for any in-progress video
2. If found, report status and ask: "检测到未完成的视频项目 `{name}`，当前在第 {N} 步。是否继续？"
   - **继续** → Resume from the failed/incomplete step
   - **重新开始** → Reset state, start from Step 1
   - **新视频** → Start a different video, keep old state
3. If not found, start fresh

### Step Lifecycle

Each step follows this pattern:
1. Update state: `status: "in_progress"`
2. Execute step
3. On success: `status: "completed"`, record `completed_at`
4. On failure: `status: "failed"`, record `error` message
5. On skip (auto mode): `status: "skipped"`

### Manual Resume

Users can explicitly resume:
- "继续上次的视频" → find latest workflow_state.json, resume
- "从第8步开始" → resume from Step 8 (validate prior steps' outputs exist)

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
 3c. (Optional) Collect/generate video assets for T13 → video files
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
- [ ] Video codec is HEVC (H.265)
- [ ] Audio-video sync verified
- [ ] No black frames

**After Step 12 (Final)**:
- [ ] `final_video.mp4` resolution is 3840x2160
- [ ] Video codec is HEVC (H.265)
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
- [ ] HEVC 硬件加速检测已完成
- [ ] 磁盘空间充足 (>20GB for 4K)

**渲染后检查**:
- [ ] 视频时长正确
- [ ] 音画同步
- [ ] 字幕显示正常
- [ ] 无黑屏/空白帧
