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
│   ├── {section}_{index}.{ext}         # 通用素材
│   ├── {section}_screenshot.png        # 网页截图
│   ├── {section}_logo.png              # Logo
│   ├── {section}_web_{index}.{ext}     # 网络图片
│   └── {section}_ai.png                # AI 生成图片
│
├── videos/{video-name}/                # 视频项目资产 (非 Remotion 代码)
│   ├── topic_definition.md             # Step 1: 主题定义
│   ├── research/                       # Step 2: 研究资料 (多文件)
│   │   ├── _index.md                  # 研究索引与摘要
│   │   └── research_*.md             # 按维度分类的研究文件
│   ├── section_outline.md              # Step 3: 章节大纲
│   ├── section_density.md              # Step 3: 密度分析
│   ├── section_ui.md                   # Step 3: UI 设计文档
│   ├── podcast.txt                     # Step 4: 旁白脚本
│   ├── media_manifest.json             # Step 5: 素材清单
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

### Progress Tracking

在 Step 1 开始时，使用 `TaskCreate` **按以下列表逐条创建 tasks**（不要合并或省略），每步开始时 `TaskUpdate` 为 `in_progress`，完成后标记 `completed`：

```
 1. Define topic direction (brainstorming) → topic_definition.md
 2a. Research Round 1 (breadth) → research/*.md
 2b. Brainstorm with user → confirm/expand research
 2c. Research Round 2-3 (depth + verify) → research/_index.md
 3a. Chapter Blueprint → section_outline.md (draft)
 3b. Per-section interactive design (iterate with user)
 3c. Global style + output documents → section_outline.md, section_density.md, section_ui.md
 4. Write narration script → podcast.txt
 5. Collect media assets → media_manifest.json
 6. Generate publish info (Part 1) → publish_info.md
 7. Generate thumbnails (16:9 + 4:3) → thumbnail_*.png
 8. Generate TTS audio → podcast_audio.wav, timing.json
 9. Create Remotion composition + Studio preview
10. Render 4K video → output.mp4
11. Mix background music → video_with_bgm.mp4
12. Add subtitles (optional) → final_video.mp4
13. Complete publish info (Part 2) → chapter timestamps
14. Verify output (resolution, sync, files)
15. Cleanup temp files (optional)
```

### Validation Checkpoints

**After Step 8 (TTS)**:
- [ ] `podcast_audio.wav` exists and plays correctly
- [ ] `timing.json` has all sections with correct timestamps
- [ ] `podcast_audio.srt` encoding is UTF-8

**After Step 10 (Render)**:
- [ ] `output.mp4` resolution is 3840x2160
- [ ] Audio-video sync verified
- [ ] No black frames

**After Step 12 (Final)**:
- [ ] `final_video.mp4` resolution is 3840x2160
- [ ] Subtitles display correctly (if added)
- [ ] File size is reasonable

---

## Step 1: Define Topic Direction

使用 `brainstorming` skill 确认：
1. **目标受众**: 技术开发者 / 普通用户 / 学生 / 专业人士
2. **视频定位**: 科普入门 / 深度解析 / 新闻速报 / 教程实操
3. **内容范围**: 历史背景 / 技术原理 / 使用方法 / 对比评测
4. **视频风格**: 严肃专业 / 轻松幽默 / 快节奏
5. **时长预期**: 短 (1-3分钟) / 中 (3-7分钟) / 长 (7-15分钟)

保存为 `videos/{name}/topic_definition.md`

---

## Step 2: Research Topic (Deep Research)

基于 Step 1 的 `topic_definition.md`，执行多轮深度调研。所有研究文件保存到 `videos/{name}/research/` 目录。

### Phase 2.1: 初始调研 (Round 1 — Breadth)

**Claude behavior:**

1. 读取 `videos/{name}/topic_definition.md`，提取关键维度
2. 生成 4-6 个不同角度的搜索查询：

| 维度类型 | 查询示例 |
|----------|----------|
| 背景/历史 | "{主题} history timeline" |
| 技术原理 | "{主题} how it works architecture" |
| 对比/竞品 | "{主题} vs alternatives comparison" |
| 应用/案例 | "{主题} use cases real world examples" |
| 争议/局限 | "{主题} limitations criticism problems" |
| 最新动态 | "{主题} 2026 latest news updates" |

3. 执行 Round 1（广度搜索）：使用 WebSearch + WebFetch 收集各维度资料
4. 为每个维度创建 `videos/{name}/research/research_{dimension}.md`

**research_*.md 文件内部结构：**

```markdown
# {维度名称}

## Primary Sources [P]
- **[来源标题](URL)** — 一句话摘要
  > 关键引用或数据

## Secondary Sources [S]
- ...

## Tertiary Sources [T]
- ...

## 关键发现
- [本维度最重要的 3-5 个结论]
```

**来源质量分级：**

| 级别 | 标记 | 定义 | 示例 |
|------|------|------|------|
| Primary | [P] | 一手来源、官方文档、原始论文 | 官方博客、GitHub repo、学术论文 |
| Secondary | [S] | 二手分析、新闻报道、技术评测 | 科技媒体、知名博主评测 |
| Tertiary | [T] | 百科、综合性概述 | 维基百科、知乎回答 |

**Round 1 完成标准：** ≥4 个维度文件，每个 ≥3 条来源。

### Phase 2.2: 头脑风暴 (Brainstorm with User)

**Claude behavior:** 向用户呈现研究摘要并收集反馈。每次 AskUserQuestion 问 1-2 个相关问题，分多轮进行。

**呈现内容：** 2-3 段研究摘要（每段 50-80 字），覆盖最重要的发现。

**问题类型：**

| 类型 | 数量 | 格式 | 示例 |
|------|------|------|------|
| 事实确认 | 3-5 个 | YES/NO | "XXX 于 2024 年发布，目前市场份额约 30%，是否准确？" |
| 范围确认 | 2-3 个 | YES/NO | "是否需要覆盖 XXX 的历史演进？" |
| 深度偏好 | 1 个 | 多选 | "以下哪个角度最想深入？A) 技术原理 B) 应用案例 C) 对比评测" |
| 开放补充 | 1 个 | 自由回答 | "还有什么遗漏的内容或你特别想提到的？" |

**Gap-filling:** 用户回答后，如果发现新的研究空白，立即使用 WebSearch 补充搜索。

### Phase 2.3: 结构化输出 (Structured Output)

**Claude behavior:**

1. **Round 2（深度）：** 基于用户反馈，深入搜索用户最关注的维度，补充具体数据、案例、引用
2. **Round 3（验证）：** 交叉验证关键事实（至少 2 个独立来源确认），补充具体数据点（数字、日期、版本号）
3. 更新各 `research_*.md` 文件
4. 生成 `videos/{name}/research/_index.md` 索引文件

**research/_index.md 模板：**

```markdown
# {主题} — 研究索引

## 调研概要
[200-300字总结：主题是什么、为什么重要、当前状态]

## 调研维度
| 文件 | 维度 | 要点概括 | 来源数 |
|------|------|---------|--------|
| research_history.md | 背景/历史 | ... | 5 |
| research_tech.md | 技术原理 | ... | 4 |
| ... | ... | ... | ... |

## 关键数据点 (供脚本使用)
- [可直接用于旁白的数字、日期、引用]
- 例："{产品} 于 2024 年 3 月发布，截至 2026 年用户超 500 万"

## 建议章节主题
1. [章节建议] — 对应 research_xxx.md
2. ...

## 调研轮次记录
- Round 1 (广度): [搜索了哪些维度，获得多少来源]
- Round 2 (深度): [深入了哪些方向，补充了什么]
- Round 3 (验证): [验证了哪些事实，修正了什么]
```

### Phase 2.4: 多轮保证 (Multi-Round Guarantee)

| 轮次 | 目标 | 完成标准 |
|------|------|----------|
| Round 1 | 广度覆盖 | ≥4 维度，每维度 ≥3 来源 |
| Round 2 | 深度补充 | 用户关注维度有 ≥5 条高质量来源 |
| Round 3 | 事实验证 | 关键数据点均有 ≥2 个独立来源确认 |

3 轮后仍有明显空白，可追加至第 5 轮。

**Phase 2 完成条件：**

- [ ] `research/` 目录包含 ≥4 个维度文件
- [ ] `research/_index.md` 索引文件已生成，包含调研概要和关键数据点
- [ ] 已与用户完成至少一轮头脑风暴确认
- [ ] 关键事实已交叉验证
- [ ] 建议章节主题已列出（供 Step 3 使用）

---

## Step 3: Design Video Sections (Video PRD)

基于 Step 2 的 `research/_index.md`，与用户逐章节交互设计视频结构。输出 3 个文档：`section_outline.md`、`section_density.md`、`section_ui.md`。

### Phase 3.1: 章节蓝图 (Chapter Blueprint)

**Claude behavior:**
1. 读取 `videos/{name}/research/_index.md` 的"建议章节主题"和"关键数据点"
2. 生成初始章节蓝图表：

| # | Section Name | 章节标题 | 对应研究维度 | 关键数据点 | 预估时长 |
|---|-------------|---------|-------------|-----------|---------|
| 1 | hero | 开场引入 | — | 1 个核心悬念 | 15-25s |
| 2 | {name} | {title} | research_{x}.md | {data} | 30-45s |
| ... | ... | ... | ... | ... | ... |
| N | outro | 片尾 | — | — | 10-15s |

**规则：**
- `hero`（首章）和 `outro`（末章）为必需章节
- `summary` 推荐但可选，`references` 可选
- 内容章节数 3-7 个（总章节 5-9 个）
- 预估总时长须与 `topic_definition.md` 时长预期一致

3. 使用 `AskUserQuestion` 将蓝图表呈现给用户，请求确认/增删/重排章节
4. 根据用户反馈迭代，直至用户确认章节列表

### Phase 3.2: 逐章节交互设计 (Per-Section Design)

对每个内容章节（`hero`/`outro` 除外），呈现设计卡片并逐一与用户确认。

**组件选择参考表：**

| 组件 | 适用场景 | 密度等级 | 典型内容项数 |
|------|---------|---------|------------|
| ComparisonCard | A vs B 对比 | Standard | 2 列 |
| Timeline | 时间线/发展历程 | Compact | 3-6 节点 |
| CodeBlock | 代码/命令展示 | Standard | 5-15 行 |
| QuoteBlock | 名人名言/重要引用 | Impact | 1 引用 |
| FeatureGrid | 多特性展示 | Compact/Dense | 3-6 卡片 |
| DataBar | 数据对比/排名 | Standard/Compact | 3-6 条 |
| StatCounter | 关键数字展示 | Standard | 2-4 计数器 |
| FlowChart | 流程/步骤 | Standard/Compact | 3-5 步 |
| IconCard | 单个重点强调 | Impact/Standard | 1 卡片 |

**逐章节设计卡片模板：**

```
=== 章节 {N}: {section_name} — {章节标题} ===

📚 参考来源:
  - research_xxx.md: [具体发现]
  - research_yyy.md: [相关数据]

📝 内容范围:
  - 核心观点 1
  - 核心观点 2
  - 可引用数据: "..."

🎨 建议视觉表现:
  - 组件: FeatureGrid (3列)
  - 布局: PaddedLayout
  - 背景色: #f5f5f5
  - 密度: Standard (3 items)

⏱️ 时间预算: 40s

✅ 差异化检查: 与上一章在 [背景色, 内容形式] 上不同
```

**Claude behavior:**
1. 对每个内容章节，填充上述卡片模板
2. 使用 `AskUserQuestion` 逐章节呈现，用户可调整或说"OK"继续下一章
3. 自动检查相邻章节差异化约束（背景色、组件类型、密度级别不应与相邻章节完全相同）

### Phase 3.3: 全局风格确认 (Global Style Confirmation)

所有章节设计完成后，呈现全局设计总览并请用户确认。

**密度分配总览：** 汇总各章节密度等级，确保节奏合理。

**Content Density 参考表：**

| Tier | Items | Best For |
|------|-------|----------|
| **Impact** | 1 | Hook, hero, CTA, brand moment — largest text |
| **Standard** | 2-3 | Features, comparison, demo |
| **Compact** | 4-6 | Feature grid, ecosystem |
| **Dense** | 6+ | Data tables, detailed comparisons — smallest text |

**Title Position Confirmation:**

使用 AskUserQuestion 询问用户标题位置偏好：

| 位置 | 风格 | 适用场景 |
|------|------|----------|
| **顶部居中** | 视频风格 | 大多数视频内容 (推荐) |
| **顶部左侧** | 演示风格 | 商务/正式内容 |
| **全屏居中** | 英雄风格 | 仅用于 Hook/Hero 场景 |

**规则：** 单个视频内保持标题位置一致。

**配色方案确认：** 呈现建议的 primaryColor / backgroundColor / textColor / accentColor，请用户确认。

**转场效果选择：** 建议转场效果（fade/slide/wipe）和转场时长（默认 15 帧），请用户确认。

### Phase 3.4: 输出文档生成 (Output Documents)

根据 Phase 3.1-3.3 的设计决策，生成 3 个文档到 `videos/{name}/`：

**1. `section_outline.md` — 详细章节大纲：**

```markdown
# {主题} — 详细章节大纲

## 基本信息
- 总章节数: N
- 预估总时长: X分Y秒
- 目标时长: [来自 topic_definition.md]

## 章节大纲

### 1. hero — 开场引入
- **时间预算**: 20s
- **内容范围**: [要讲什么]
- **核心数据点**: [来自研究]
- **参考来源**: —
- **叙事目标**: 抓住注意力

### 2. {section_name} — {章节标题}
- **时间预算**: 40s
- **内容范围**: [要点1, 要点2, 要点3]
- **核心数据点**: [数字、日期、引用]
- **参考来源**: research_xxx.md, research_yyy.md
- **叙事目标**: [让观众记住什么]
```

**2. `section_density.md` — 密度分析：**

```markdown
# {主题} — 章节密度分析

## 密度分配总览
| # | 章节 | 密度 | 内容项数 | 预估时长 | 占比 |
|---|------|------|---------|---------|------|

## 密度平衡检查
- [ ] Impact 章节: N 个 (建议 1-2)
- [ ] Standard 章节: N 个 (建议 2-3)
- [ ] Compact 章节: N 个 (建议 0-2)
- [ ] Dense 章节: N 个 (建议 0-1)
- [ ] 最长/最短章节比值 ≤ 3:1

## 节奏曲线
[文字描述信息密度变化：开头 Impact → 中段交替 Standard/Compact → 结尾 Impact]
```

**3. `section_ui.md` — UI 设计文档：**

```markdown
# {主题} — 章节 UI 设计文档

## 全局设计规范
- primaryColor: #xxx
- backgroundColor: #xxx
- textColor: #xxx
- accentColor: #xxx
- 标题位置: 顶部居中
- 转场效果: fade
- 转场时长: 15 帧

## 视频级检查清单
- [ ] ≥3 种布局类型
- [ ] 相邻章节背景色不同
- [ ] 统一配色方案

## 逐章节 UI 设计

### 1. hero
- **布局**: FullBleedLayout
- **背景色**: #ffffff
- **组件**: 纯文字
- **动画**: useEntrance
- **字号**: title=80px, subtitle=40px

### 2. {section_name}
- **布局**: PaddedLayout
- **背景色**: #f5f5f5
- **组件**: FeatureGrid (columns=3)
- **动画**: useEntrance + stagger
- **字号**: section_title=72px, card_title=34px, body=26px
- **与前一章差异**: 背景色(白→灰), 内容形式(文字→卡片)
```

### Phase 3.5: 验证与交付 (Validation)

生成文档后，执行以下验证清单：

| # | Check | Requirement |
|---|-------|-------------|
| 1 | 章节数量 | 5-9 个 |
| 2 | 布局多样性 | ≥3 种不同布局类型 |
| 3 | 背景交替 | 相邻章节背景色不同 |
| 4 | 密度平衡 | Impact:1-2, Standard:2-3, Compact:0-2, Dense:0-1 |
| 5 | 时长匹配 | 与 Step 1 预期一致 |
| 6 | 研究覆盖 | _index.md 建议章节主题均已覆盖 |
| 7 | 组件多样性 | 相邻章节不重复使用相同主要组件 |
| 8 | 排版层次 | 每个章节有 2+ 级文字大小 |

**Step 3 完成条件：**

- [ ] Phase 3.1 章节蓝图已获用户确认
- [ ] Phase 3.2 所有内容章节已逐一获用户确认
- [ ] Phase 3.3 全局风格已获用户确认
- [ ] `section_outline.md` 已生成
- [ ] `section_density.md` 已生成
- [ ] `section_ui.md` 已生成
- [ ] Phase 3.5 验证清单全部通过

---

## Step 4: Write Narration Script

**Claude behavior:** Before writing podcast.txt, read:
1. `videos/{name}/section_outline.md` — 章节名称、内容范围、核心数据点
2. `videos/{name}/section_ui.md` — 章节名称须与 `[SECTION:xxx]` 标记完全一致
3. `videos/{name}/research/_index.md` — 已验证的关键数据点

Create `videos/{name}/podcast.txt` with section markers:

```text
[SECTION:hero]
大家好，欢迎来到本期视频。今天我们聊一个...

[SECTION:features]
它有以下功能...

[SECTION:demo]
让我演示一下...

[SECTION:summary]
总结一下，xxx是目前最xxx的xxx。

[SECTION:references]
本期视频参考了官方文档和技术博客。

[SECTION:outro]
感谢观看！点赞投币收藏，关注我，下期再见！
```

**数字必须使用中文读音** - 所有数字必须写成中文，TTS 才能正确朗读：

| 类型 | ❌ 错误 | ✅ 正确 |
|------|---------|---------|
| 整数 | 29, 3999, 128 | 二十九，三千九百九十九，一百二十八 |
| 小数 | 1.2, 3.5 | 一点二，三点五 |
| 百分比 | 15%, -10% | 百分之十五，负百分之十 |
| 日期 | 2025-01-15 | 二零二五年一月十五日 |
| 大数字 | 6144, 234324 | 六千一百四十四，二十三万四千三百二十四 |
| 英文单位 | 128GB, 273GB/s | 一百二十八G，二百七十三GB每秒 |
| 科学记数 | 1 PFLOPS | 一PFLOPS |

**示例对比**:
```text
❌ 错误: 售价3999美元，内存128GB，去年10月15日开卖
✅ 正确: 售价三千九百九十九美元，内存一百二十八GB，去年十月十五日开卖

❌ 错误: DeepSeek R1 14B每秒2074个token
✅ 正确: DeepSeek R1蒸馏版十四B每秒两千零七十四个token
```

**章节说明**:
- **summary**: 纯内容总结，不包含互动引导
- **references** (可选): 一句话概括参考来源
- **outro**: 感谢 + 一键三连引导
- 空内容的 `[SECTION:xxx]` 为静音章节

### Duration Estimation (Dry Run)

**Claude behavior:** After writing `podcast.txt`, automatically run dry-run to estimate video duration:

```bash
python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name} --dry-run
```

Report estimated duration to user. If too long (>12min) or too short (<3min), suggest adjustments before proceeding to TTS.

---

## Step 5: Collect Media Assets

**首先询问用户**：是否需要使用 **imagen skill** 生成 AI 图片素材？

Claude 逐章节询问素材来源：
1. **跳过** - 纯文字动效
2. **本地文件** - 指定路径
3. **网页截图** - Playwright 截图
4. **网络检索** - 搜索下载
   - **Unsplash** (https://unsplash.com) - 高质量免费图片
   - **Pexels** (https://pexels.com) - 免费 CC0 图片
   - **Pixabay** (https://pixabay.com) - 免费素材库
   - **unDraw** (https://undraw.co) - 开源 SVG 插图
   - **StockSnap** (https://stocksnap.io) - 高清免费图片
   - **Simple Icons** (https://simpleicons.org) - 品牌 SVG 图标
5. **AI 生成** - 使用 imagen skill（需用户确认）

如果用户选择 AI 生成，调用 imagen skill 生成图片：
```
使用 imagen skill 生成：[图片描述]
```

素材保存到 `public/media/{video-name}/`，生成 `media_manifest.json`。


---

## Step 6: Generate Publish Info (Part 1)

基于 `podcast.txt` 生成 `publish_info.md`:
- 标题（数字 + 主题 + 吸引词）
- 标签（10个，含产品名/领域词/热门标签）
- 简介（100-200字）

---

## Step 7: Generate Video Thumbnail

**询问用户选择封面生成方式**:
1. **Remotion生成** - 代码控制，风格与视频一致
2. **AI文生图（imagen skill）** - 使用 imagen skill 生成创意封面
3. **两者都生成** - 同时生成两种风格供选择

⚠️ **必须生成两个比例**: 16:9 (播放页) 和 4:3 (推荐流/动态)，缺一不可。9:16 仅在生成竖屏视频时需要。

**Remotion 渲染封面**:
```bash
npx remotion still src/remotion/index.ts Thumbnail16x9 videos/{name}/thumbnail_remotion_16x9.png
npx remotion still src/remotion/index.ts Thumbnail4x3 videos/{name}/thumbnail_remotion_4x3.png
# Optional: vertical thumbnail (only if rendering vertical video)
npx remotion still src/remotion/index.ts Thumbnail9x16 videos/{name}/thumbnail_remotion_9x16.png
```

**使用 imagen skill 生成封面**:
```
使用 imagen skill 生成视频封面：
- 主题：[视频主题]
- 风格：科技感/简约/活泼
- 比例：16:9 和 4:3
```

---

## Step 8: Generate TTS Audio

```bash
cp ~/.claude/skills/video-podcast-maker/generate_tts.py .

# Dry run: estimate duration without calling TTS API
python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name} --dry-run

# Azure TTS (default, requires AZURE_SPEECH_KEY)
python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name}

# CosyVoice backend (requires DASHSCOPE_API_KEY)
TTS_BACKEND=cosyvoice python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name}

# Edge TTS (free, no API key required)
TTS_BACKEND=edge python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name}

# Resume from breakpoint (skip already synthesized parts)
python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name} --resume

# Control speech rate (default: +5%)
TTS_RATE="+15%" python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name}

# Override Edge TTS voice
EDGE_TTS_VOICE="zh-CN-YunxiNeural" TTS_BACKEND=edge python3 generate_tts.py --input videos/{name}/podcast.txt --output-dir videos/{name}
```

### Environment Variables (TTS)

| Variable | Default | Description |
|----------|---------|-------------|
| `TTS_BACKEND` | `azure` | Backend: `azure`, `cosyvoice`, or `edge` (free) |
| `TTS_RATE` | `+5%` | Speech rate: `-50%` to `+200%` |
| `EDGE_TTS_VOICE` | `zh-CN-XiaoxiaoNeural` | Voice for Edge TTS backend |
| `AZURE_SPEECH_KEY` | - | Required for Azure backend |
| `AZURE_SPEECH_REGION` | `eastasia` | Azure region |
| `DASHSCOPE_API_KEY` | - | Required for CosyVoice backend |

### 多音字/发音校正 (SSML Phoneme)

TTS 脚本支持三种方式校正发音，优先级从高到低：

**1. 内联标注** (最高优先级) - 在 podcast.txt 中直接标注：
```text
每个执行器[zhí xíng qì]都有自己的上下文窗口
如果不合格，就打回重做[chóng zuò]
```

**2. 项目词典** - 在 `videos/{name}/phonemes.json` 中定义：
```json
{
  "执行器": "zhí xíng qì",
  "重做": "chóng zuò",
  "一行命令": "yì háng mìng lìng"
}
```

**3. 内置词典** - 预置常见多音字（自动应用）：

| 词语 | 拼音 | 说明 |
|------|------|------|
| 执行/运行/并行 | xíng | "行"作"执行"义 |
| 一行命令/代码行 | háng | "行"作"行列"义 |
| 重做/重新/重复 | chóng | "重"作"重复"义 |

**拼音格式**: 使用带声调符号的拼音（如 `zhí xíng qì`），脚本会自动转换为 Azure SAPI 格式。

**Outputs**: `podcast_audio.wav`, `podcast_audio.srt`, `timing.json`

**timing.json `label` field**: Each section gets a human-readable label extracted from the first line of its content (before first punctuation, max 10 chars). This is displayed in the `ProgressBar` component. Example: `[SECTION:hero]` with content "大家好，欢迎来到本期视频" → `label: "大家好"`. Silent sections use the section name as label.
---

## Step 9: Create Remotion Composition + Studio Preview

复制文件到 public/:
```bash
cp videos/{name}/podcast_audio.wav videos/{name}/timing.json public/
```

使用 `timing.json` 同步。

### 标准视频模板（必须遵循）

使用 `templates/Video.tsx` 作为起点，已包含完整实现（4K 缩放、章节进度条、音频集成）。

```bash
cp ~/.claude/skills/video-podcast-maker/templates/Video.tsx src/remotion/
cp ~/.claude/skills/video-podcast-maker/templates/Root.tsx src/remotion/
cp -r ~/.claude/skills/video-podcast-maker/templates/components src/remotion/components
```

Components are modular — import only what you need:
```tsx
import { ComparisonCard, CodeBlock, FeatureGrid } from "./components";
```

### 章节转场效果

模板使用 `@remotion/transitions` 的 `TransitionSeries` 实现章节间平滑过渡。

**Studio UI 可配置项：**

| 属性 | 默认值 | 说明 |
|------|--------|------|
| `transitionType` | `fade` | 转场类型：fade / slide / wipe / none |
| `transitionDuration` | `15` (0.5秒) | 转场时长（帧数） |

**可用转场效果：**

| 类型 | 效果 | 适用场景 |
|------|------|----------|
| `fade` | 淡入淡出 | 通用，最安全 |
| `slide` | 从右侧滑入 | 步骤推进、教程类 |
| `wipe` | 从右侧擦除 | 揭示、转折 |
| `none` | 硬切（无转场） | 快节奏内容 |

安装依赖（项目中执行）：
```bash
npm install @remotion/transitions
```

### 关键架构说明

| 要点 | 说明 |
|------|------|
| **ProgressBar 位置** | 必须放在 `scale(2)` 容器**外部**，否则宽度会被压缩 |
| **章节宽度分配** | 使用 `flex: ch.duration_frames` 按时长比例分配 |
| **进度指示** | 当前章节内显示白色进度条，底部显示总进度 |
| **4K 缩放** | 内容区域使用 `scale(2)` 从 1920×1080 放大到 3840×2160 |

**ProgressBar 默认启用**，提供用户导航和进度反馈。如不需要，可在创建视频组件时告知 Claude 关闭。

### 一键三连片尾

**Claude behavior:** 使用 AskUserQuestion 询问用户片尾一键三连的实现方式：

> "片尾一键三连动画如何实现？"
>
> - **使用预制 MP4 动画（推荐）** — 直接嵌入专业制作的一键三连动画视频，黑白两版可选
> - **Remotion 代码生成** — 用 Remotion 组件渲染自定义一键三连动画

**预制 MP4 用法：**

```bash
# 复制到项目 public 目录
cp ~/.claude/skills/video-podcast-maker/assets/bilibili-triple-white.mp4 public/media/{video-name}/
# 或黑色背景版本
cp ~/.claude/skills/video-podcast-maker/assets/bilibili-triple-black.mp4 public/media/{video-name}/
```

```tsx
// 在 outro section 中使用 <OffthreadVideo> 嵌入
import { OffthreadVideo, staticFile } from "remotion";

// 白色背景版
<OffthreadVideo src={staticFile("media/{video-name}/bilibili-triple-white.mp4")} />
// 黑色背景版
<OffthreadVideo src={staticFile("media/{video-name}/bilibili-triple-black.mp4")} />
```

可用素材：
| 文件 | 背景 | 适用场景 |
|------|------|----------|
| `bilibili-triple-white.mp4` | 白色 | 默认白色主题视频 |
| `bilibili-triple-black.mp4` | 黑色 | 深色主题视频 |

### Studio Preview & Iterative Refinement

**Claude behavior:** 使用 AskUserQuestion 询问用户：

> "建议先启动 Remotion Studio 预览，迭代修改满意后再渲染最终 4K 视频，可以节省大量渲染时间。是否启动预览？"
>
> - **是（推荐）** — 启动 Studio 预览，迭代修改，满意后再执行渲染
> - **否** — 跳过预览，直接渲染 4K 视频

```bash
npx remotion studio src/remotion/index.ts
```

**Iterative feedback loop:**

1. Launch `remotion studio` (real-time preview, hot reload)
2. **Ask user:** "预览效果满意吗？如果需要调整，请描述修改意见（例如：标题太小、背景换深色、动画太快）"
   - **Options:**
     - **满意，继续渲染** → proceed to Step 10
     - **需要修改** → user provides feedback in natural language
3. Apply user's modifications to component code (Studio hot reloads automatically)
4. **Repeat from step 2** until user is satisfied

**Common modification examples:**

| User Feedback | Action |
|---------------|--------|
| "标题太小" | Increase title fontSize |
| "背景换成深色" | Change backgroundColor |
| "动画太快" | Adjust animation duration/spring config |
| "章节之间太突兀" | Add fade transition between sections |
| "进度条太粗" | Reduce progressBarHeight |
| "发音不对" | Fix in `podcast.txt` or `phonemes.json`, re-run `generate_tts.py`, copy to `public/` |

> **Note:** Studio supports hot reload — code changes reflect instantly without restarting. Pronunciation fixes require re-running TTS (Step 8) and copying updated files to `public/`.

---

## Step 10: Render Video

> Use `npx remotion studio` for preview, then render directly for final output.

```bash
npx remotion render src/remotion/index.ts CompositionId videos/{name}/output.mp4 --video-bitrate 16M
```

**验证 4K**:
```bash
ffprobe -v quiet -show_entries stream=width,height -of csv=p=0 videos/{name}/output.mp4
# 期望: 3840,2160
```

### Optional: Render Vertical Highlight Clip (9:16)

Generate a 60-90 second vertical video for B站竖屏/短视频, using the same audio and components.

```bash
# Render vertical version (uses MyVideoVertical composition)
npx remotion render src/remotion/index.ts MyVideoVertical videos/{name}/output_vertical.mp4 --video-bitrate 16M

# Render 9:16 thumbnail
npx remotion still src/remotion/index.ts Thumbnail9x16 videos/{name}/thumbnail_remotion_9x16.png

# Verify
ffprobe -v quiet -show_entries stream=width,height -of csv=p=0 videos/{name}/output_vertical.mp4
# 期望: 2160,3840
```

The vertical composition reuses the same Video.tsx component with `orientation: "vertical"`. All section layouts, components (ComparisonCard, FeatureGrid, etc.), and Scale4K automatically adapt for 9:16.

---

## Step 11: Mix with Background Music

```bash
cp ~/.claude/skills/video-podcast-maker/assets/perfect-beauty-191271.mp3 videos/{name}/bgm.mp3

ffmpeg -y \
  -i videos/{name}/output.mp4 \
  -stream_loop -1 -i videos/{name}/bgm.mp3 \
  -filter_complex "[0:a]volume=1.0[a1];[1:a]volume=0.05[a2];[a1][a2]amix=inputs=2:duration=first[aout]" \
  -map 0:v -map "[aout]" \
  -c:v copy -c:a aac -b:a 192k \
  videos/{name}/video_with_bgm.mp4
```

---

## Step 12: Add Subtitles (可选)

**Claude behavior:** Ask before skipping: "需要烧录字幕吗？字幕可以提高视频的可访问性。"

如不需要字幕：
```bash
cp videos/{name}/video_with_bgm.mp4 videos/{name}/final_video.mp4
```

**添加字幕（纯白背景用深色字幕）**:
```bash
ffmpeg -y -i videos/{name}/video_with_bgm.mp4 \
  -vf "subtitles=videos/{name}/podcast_audio.srt:force_style='FontName=PingFang SC,FontSize=14,PrimaryColour=&H00333333,OutlineColour=&H00FFFFFF,Bold=1,Outline=2,Shadow=0,MarginV=20'" \
  -c:v libx264 -crf 18 -preset slow -s 3840x2160 \
  -c:a copy videos/{name}/final_video.mp4
```

**关键参数**:
- `-s 3840x2160` - 强制 4K
- `-crf 18 -preset slow` - 高质量编码

---

## Step 13: Complete Publish Info (Part 2)

从 `timing.json` 生成 B站章节：

```
00:00 开场
00:23 功能介绍
00:55 演示
01:20 总结
```

格式：`MM:SS 章节标题`，每段间隔 ≥5秒。

---

## Step 14: Verify Output

视频完成后，执行以下验证：

### 14.1 文件存在性检查

```bash
VIDEO_DIR="videos/{name}"
echo "=== 文件检查 ==="
for f in podcast.txt podcast_audio.wav podcast_audio.srt timing.json output.mp4 final_video.mp4; do
  [ -f "$VIDEO_DIR/$f" ] && echo "✓ $f" || echo "✗ $f 缺失"
done
```

### 14.2 技术指标验证

```bash
echo "=== 技术指标 ==="
# 分辨率
RES=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$VIDEO_DIR/final_video.mp4")
[ "$RES" = "3840,2160" ] && echo "✓ 分辨率: 3840x2160 (4K)" || echo "✗ 分辨率: $RES (非4K)"

# 时长
DUR=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$VIDEO_DIR/final_video.mp4" | cut -d. -f1)
echo "✓ 时长: ${DUR}s"

# 编码
CODEC=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$VIDEO_DIR/final_video.mp4")
echo "✓ 视频编码: $CODEC"

# 文件大小
SIZE=$(ls -lh "$VIDEO_DIR/final_video.mp4" | awk '{print $5}')
echo "✓ 文件大小: $SIZE"
```

### 14.3 验证报告模板

完成验证后，向用户报告：

```
=== 验证完成 ===
✓ 文件完整性: 6/6
✓ 分辨率: 3840x2160
✓ 时长: XXs
✓ 编码: h264
✓ 大小: XXX MB

是否需要清理临时文件？(Step 15)
```

---

## Step 15: Cleanup (可选)

**Claude behavior:** Ask before skipping: "要清理临时文件吗？可以释放磁盘空间，但会删除中间产物。"

### 15.1 列出临时文件

执行前，先向用户展示将被删除的文件：

```bash
VIDEO_DIR="videos/{name}"
echo "=== 将删除的临时文件 ==="
ls -lh "$VIDEO_DIR"/part_*.wav 2>/dev/null | awk '{print $9, "(" $5 ")"}'
ls -lh "$VIDEO_DIR"/concat_list.txt 2>/dev/null | awk '{print $9, "(" $5 ")"}'
ls -lh "$VIDEO_DIR"/output.mp4 2>/dev/null | awk '{print $9, "(" $5 ")"}'
ls -lh "$VIDEO_DIR"/video_with_bgm.mp4 2>/dev/null | awk '{print $9, "(" $5 ")"}'
echo ""
echo "=== 将保留的文件 ==="
ls -lh "$VIDEO_DIR"/final_video.mp4 "$VIDEO_DIR"/podcast_audio.wav "$VIDEO_DIR"/podcast_audio.srt "$VIDEO_DIR"/timing.json "$VIDEO_DIR"/podcast.txt 2>/dev/null | awk '{print $9, "(" $5 ")"}'
```

### 15.2 用户确认

**询问用户**:
> 以上临时文件将被删除，保留最终成品和源文件。是否继续？

### 15.3 执行清理

用户确认后执行：

```bash
VIDEO_DIR="videos/{name}"
rm -f "$VIDEO_DIR"/part_*.wav
rm -f "$VIDEO_DIR"/concat_list.txt
rm -f "$VIDEO_DIR"/output.mp4
rm -f "$VIDEO_DIR"/video_with_bgm.mp4
echo "✓ 临时文件已清理"
```

### 15.4 清理后文件结构

```
videos/{name}/
├── final_video.mp4      # 最终成品
├── podcast.txt          # 原始脚本
├── podcast_audio.wav    # 音频
├── podcast_audio.srt    # 字幕
├── timing.json          # 时间轴
├── research/            # 研究资料
│   ├── _index.md
│   └── research_*.md
├── section_outline.md   # 章节大纲
├── section_density.md   # 密度分析
├── section_ui.md        # UI 设计文档
├── publish_info.md      # 发布信息
├── thumbnail_*_16x9.png # 封面图 16:9 (必须)
└── thumbnail_*_4x3.png  # 封面图 4:3 (必须)
```

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
