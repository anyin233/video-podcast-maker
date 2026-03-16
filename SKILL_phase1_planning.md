---
name: video-podcast-maker-phase1
description: "Phase 1: Planning — Topic definition, deep research, media consolidation, and Video PRD design (Steps 1-4)"
type: phase
phase: 1
steps: "1-4"
prev: null
next: SKILL_phase2_production.md
---

# Phase 1: Planning (Steps 1-4)

> **前置要求：** 确保已阅读 `SKILL.md` 中的共享规则（Technical Rules, Visual Design Minimums, Quality Checklists）。

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
- [ ] 建议章节主题已列出（供 Step 4 使用）
- [ ] 研究过程中发现的素材已保存到 `public/media/{video-name}/research/`，并在研究文件中 inline 标注

### 研究阶段素材收集 (Opportunistic Media Collection)

在研究过程中，Claude 遇到与视频主题相关的图片、截图、图表等素材时，应**立即下载**并在研究文件中标注。

**收集行为：**

1. 将素材下载到 `public/media/{video-name}/research/` 目录
2. 在研究文件中使用以下格式 inline 标注：

```markdown
二零二二年《赛马娘》第二季播出，特别是东海帝王的经典场景引发大量二创。
→ 素材已保存 `research/tokaiteio_scene.jpg` (来源: 官方截图, 用途: 东海帝王名场面)

B站数据显示，哈基米相关视频播放量在二零二三年八月达到峰值。
→ 素材已保存 `research/bilibili_trend_chart.png` (来源: 网页截图, 用途: 传播数据可视化)
```

**收集标准 — 应收集：**

| 类型 | 说明 | 示例 |
|------|------|------|
| **Evidence** | 原始梗图、数据图表、官方截图、关键人物/事件照片 | 产品截图、统计图、新闻配图 |
| **Aesthetic** | 配色参考、排版灵感、风格对标截图 | 竞品视频截图、设计参考 |
| **Ready-to-use** | 免费图库素材、SVG图标、插画、网络图片 | Pexels/Unsplash 图片、品牌 Logo |

**排除标准：** 仅排除低分辨率（<720px 宽）和有大面积水印遮挡的图片。

**研究索引更新：** `research/_index.md` 末尾增加 `## 已收集素材` 汇总所有 inline 标注的素材：

```markdown
## 已收集素材

| 文件 | 来源 | 研究维度 | 潜在用途 |
|------|------|----------|----------|
| research/tokaiteio_scene.jpg | 官方截图 | origin | 起源配图 |
| research/bilibili_trend_chart.png | 网页截图 | spread | 数据可视化 |
```

---

## Step 3: Media Consolidation (素材整理与补全)

研究完成后、PRD 开始前，系统化整理研究阶段收集的素材并补全缺口。

### Phase 3.1: 扫描与清点

**Claude behavior:**

1. 扫描所有 `research/research_*.md` 文件，提取 `→ 素材已保存` 标注
2. 生成素材清单：

```markdown
## 素材清点

| 文件 | 来源 | 研究维度 | 潜在用途 | 质量 |
|------|------|----------|----------|------|
| tokaiteio_scene.jpg | 官方截图 | origin | 起源Timeline配图 | ★★★ |
| bilibili_trend_chart.png | 网页截图 | spread | 传播数据 | ★★☆ |
| cat_meme_original.jpg | 网络图片 | cat_culture | hero/猫文化 | ★★★ |
```

### Phase 3.2: 缺口分析

基于 `research/_index.md` 的建议章节结构，Claude 判断每个潜在章节的素材覆盖情况：

```markdown
## 缺口分析

- hero: ✅ 有猫梗图，可用作背景
- origin: ✅ 有东海帝王截图
- spread: ⚠️ 只有趋势图，缺传播路径示意
- cat_era: ❌ 无素材 — 需要猫咪表情包/萌宠图
- maodi: ❌ 无素材 — 需要猫咪特写（圆头/ω嘴）
- meme_science: ✅ 数据驱动，无需外部素材
```

### Phase 3.3: 补全搜索 + AI 生成

针对 `⚠️` 和 `❌` 的缺口：

**1. 网络搜索补全** — 搜索 Pexels/Unsplash/网络图片，下载到 `public/media/{video-name}/`

**2. AI 生成提案** — 为无法搜索到的素材生成 prompt 列表，**一次性提交用户审批**：

```markdown
## AI生成提案（需要审批）

1. `maodi_portrait.png` — "可爱橘猫正面特写，圆头ω嘴，暖色调，插画风格" (imagen)
2. `spread_flow.png` — "信息传播网络示意图，节点扩散，扁平设计" (imagen)

👉 批准全部 / 逐个选择 / 跳过
```

用户批准后立即生成，下载到 `public/media/{video-name}/`。

### Phase 3.4: 视频素材收集/生成 (Optional)

> **触发条件：** 仅在用户明确要求使用视频素材时执行。不主动提议。

当用户希望在视频中嵌入视频片段（产品演示、动画、B-roll 等），Claude 协助收集或生成视频素材，配合 T13 FullVideo 模板使用。

**视频素材来源：**

| 来源 | 说明 | 获取方式 |
|------|------|----------|
| **用户提供** | 用户自有的视频文件 | 用户放入 `public/media/{video-name}/` |
| **网络收集** | 免费视频素材 (Pexels Video, Pixabay Video 等) | WebSearch + 下载 |
| **屏幕录制** | 产品演示、网页操作录屏 | 用户自行录制或使用浏览器工具 |
| **AI 生成** | AI 视频生成服务 | 根据用户指定的工具生成 |

**视频素材要求：**

| 参数 | 要求 |
|------|------|
| **格式** | MP4 (H.265/H.264) 或 WebM |
| **分辨率** | ≥1080p (推荐 1920×1080 或以上) |
| **时长** | ≤ 20s（与对应章节时长匹配，超过 20s 须裁剪或拆分多段） |
| **存放路径** | `public/media/{video-name}/{section}_video.mp4` |

**AI 视频生成提案模板：**

```markdown
## 视频生成提案（需要审批）

1. `{section}_video.mp4` — "{视频描述}" (来源: {工具名})
   - 预期时长: ~{N}s (≤20s, 超过须裁剪/拆分)
   - 用途: {section} 章节全屏播放

👉 批准全部 / 逐个选择 / 跳过
```

**Claude behavior:**

1. 仅在用户明确提出视频需求时执行此步骤
2. 评估哪些章节适合使用 T13 FullVideo 模板（产品演示、动画展示、氛围视频等）
3. 根据视频来源类型，协助用户获取或生成视频
4. 将视频素材信息记录到 `media_manifest.json`（见 Phase 3.5）

### Phase 3.5: 输出 `media_manifest.json`

所有素材（研究阶段收集 + 补全搜索 + AI 生成）汇总到 manifest：

```json
{
  "video_name": "{video-name}",
  "collected_at": "step3_consolidation",
  "assets": [
    {
      "id": "tokaiteio_scene",
      "file": "tokaiteio_scene.jpg",
      "type": "image",
      "source": "official",
      "origin_research": "research_origin.md",
      "suggested_sections": ["origin"],
      "tags": ["角色", "动画", "截图"]
    },
    {
      "id": "maodi_portrait",
      "file": "maodi_portrait.png",
      "type": "image",
      "source": "ai_generated",
      "prompt": "可爱橘猫正面特写...",
      "suggested_sections": ["maodi"]
    },
    {
      "id": "demo_video",
      "file": "demo_video.mp4",
      "type": "video",
      "source": "user_provided",
      "duration_seconds": 15,
      "suggested_sections": ["demo"],
      "template": "T13"
    }
  ]
}
```

保存到 `videos/{name}/media_manifest.json`。

**素材目录最终结构：**

```
public/media/{video-name}/
├── research/                  # 研究阶段收集的原始素材
│   ├── tokaiteio_scene.jpg
│   └── bilibili_trend_chart.png
├── tokaiteio_scene.jpg        # 整理后提升到顶层（被PRD引用的）
├── maodi_portrait.png         # AI生成
├── spread_cats.jpg            # 补全搜索
└── demo_video.mp4             # 视频素材 (T13, optional)
```

**Step 3 完成条件：**

- [ ] 所有 `research_*.md` 中的 `→ 素材已保存` 标注已扫描
- [ ] 缺口分析已完成，覆盖所有建议章节
- [ ] 网络搜索补全已执行（针对 ⚠️/❌ 缺口）
- [ ] AI 生成提案已提交用户并执行（如有）
- [ ] (Optional) 视频素材已收集/生成并存放到 `public/media/{video-name}/`（如用户要求）
- [ ] `media_manifest.json` 已生成（视频素材含 `type: "video"` 和 `template: "T13"` 字段）
- [ ] 所有最终素材已存放在 `public/media/{video-name}/` 顶层

---

## Step 4: Design Video Sections (Video PRD)

基于 Step 2 的 `research/_index.md` 和 Step 3 的 `media_manifest.json`，与用户逐章节交互设计视频结构。输出 3 个文档：`section_outline.md`、`section_density.md`、`section_ui.md`。

### Phase 4.1: 章节蓝图 (Chapter Blueprint)

**Claude behavior:**
1. 读取 `videos/{name}/research/_index.md` 的"建议章节主题"和"关键数据点"
2. 读取 `videos/{name}/media_manifest.json` 了解可用素材
3. 生成初始章节蓝图表：

| # | Section Name | 章节标题 | 对应研究维度 | 关键数据点 | 预估时长 |
|---|-------------|---------|-------------|-----------|---------|
| 1 | hero | 开场引入 | — | 1 个核心悬念 | 10-15s |
| 2 | {name} | {title} | research_{x}.md | {data} | 8-15s |
| ... | ... | ... | ... | ... | ... |
| N | outro | 片尾 | — | — | 5-10s |

**规则：**
- `hero`（首章）和 `outro`（末章）为必需章节
- `summary` 按大部分划分可选插入（见下方 Summary 规则）
- `references` 可选
- **⚠️ 观众专注度硬约束：每页最多展示 20 秒，平均 10 秒/页**（hero 10-20s，outro 5-10s，内容章节 5-20s）
- 单页旁白字数：**上限 ~80 字，平均 ~40 字**（270字/分 × 20s/60 ÷ 1.15 ≈ 78 字）
- 章节数根据视频时长动态计算：`总时长(s) ÷ 10 ≈ 章节数`（±20%），不设固定上限
- 预估总时长须与 `topic_definition.md` 时长预期一致（使用 TTS 时长估算公式）
- **信息密度原则：** 快节奏 ≠ 信息少。每页聚焦 1 个核心观点，用精炼文字 + 强视觉呈现，让观众在 10s 内抓住重点

**Summary 章节规则：**
- 将视频内容章节划分为 2-3 个"大部分"（如：背景篇、技术篇、对比篇）
- 每个大部分结束后可选插入一个 `summary_{part}` 章节，回顾该部分要点
- **严肃/专业视频**：推荐在每个大部分后加 summary（帮助观众消化密集信息）
- **轻松/科普视频**：不加 summary（保持节奏流畅）
- 视频风格在 `topic_definition.md` 中已确定，据此决定

**TTS 时长估算公式：**
- 标准播音速度：**270 字/分钟**（参考央视新闻联播标准语速）
- 自然停顿系数：**×1.15**（句间停顿、段落停顿、语气词）
- 转场开销：每个章节间 **0.5s**（15帧 fade @30fps）
- 总时长公式：`预估时长 = (总字数 ÷ 270 × 60 × 1.15) + (章节数 × 0.5)`
- **单页时长公式：** `页时长 = 该页字数 ÷ 270 × 60 × 1.15`（必须 ≤ 20s）
- **单页字数上限：** `max_chars = 270 × (20/60) / 1.15 ≈ 78 字`（平均目标 ~40 字）
- 设计卡片中的"时间预算"应基于该章节的预估旁白字数计算，而非凭感觉估算
- 示例：40 字旁白 → 40÷270×60×1.15 ≈ 10.2s ≈ 10s ✓（符合平均 10s 目标）
- 示例：75 字旁白 → 75÷270×60×1.15 ≈ 19.2s ≈ 19s ✓（接近上限但合规）
- ⚠️ 如果单页计算超过 20s，必须拆分为多个章节

4. 使用 `AskUserQuestion` 将蓝图表呈现给用户，请求确认/增删/重排章节
5. 根据用户反馈迭代，直至用户确认章节列表

### Phase 4.2: 逐章节交互设计 (Per-Section Design)

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
| T13 FullVideo | 全屏视频播放 (可选) | Impact | 1 视频文件 |

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

🖼️ 素材引用 (来自 media_manifest.json):
  - tokaiteio_scene (tokaiteio_scene.jpg) → Timeline节点1配图
  - tokaiteio_top (tokaiteio_top.png) → Timeline节点2配图
  - [无可用素材] / [本章无需素材]

📐 布局草图:
  ┌────────────────────────────────┐
  │  「章节标题」           72px   │
  │  ┌──────┐  ┌──────┐          │
  │  │[img1] │  │ 文字  │          │
  │  └──────┘  └──────┘          │
  └────────────────────────────────┘

⏱️ 时间预算: 12s (预估旁白 ~45字, 270字/分×1.15停顿系数, ≤20s ✓)

✅ 差异化检查: 与上一章在 [背景色, 内容形式] 上不同

--- T13 FullVideo 章节设计卡片示例 ---

=== 章节 {N}: {section_name} — {章节标题} (T13 FullVideo) ===

📚 参考来源:
  - media_manifest.json: demo_video (demo_video.mp4)

📝 内容范围:
  - 全屏播放视频片段，旁白配合视频内容讲解

🎬 视频素材:
  - demo_video.mp4 (15s, 1920×1080, 用户提供)
  - 模板: T13 FullVideo

⏱️ 时间预算: 15s (视频素材时长, ≤20s ✓)
  ⚠️ 如视频素材 >20s，必须裁剪或拆分为多个 T13 章节

🔄 用户修改记录: [初始/用户要求将密度从Standard改为Compact]

📏 模板内容约束检查: [通过/不通过 — 列出具体检查项]
```

**Claude behavior:**
1. 对每个内容章节，填充上述卡片模板（时间预算须用 TTS 估算公式计算，**单页 ≤ 20s**）
2. **如果单页计算时间 >20s，必须拆分为多个章节**（拆分后每个子章节独立设计卡片）
3. 使用 `AskUserQuestion` 逐章节呈现，用户可调整或说"OK"继续下一章
4. 用户修改后，更新"用户修改记录"字段，记录修改前→修改后的变化
5. 自动检查相邻章节差异化约束：背景色、密度级别不应与相邻章节完全相同；**同一组件不同配置（如 FeatureGrid 3×2 vs 3×1）不算重复**
6. **模板内容约束检查（强制）：** 选用模板后，必须验证内容满足该模板的约束条件（见 SKILL.md "模板内容约束"表）。若不满足，须调整内容量或更换模板：
   - **T03**: items 恰好 4 条，每条 description ≥ 20 中文字
   - **T05**: 仅真实可验证数据，禁止编造
   - **T06**: 仅时间线场景；label 20–40 字，description 30–50 字
   - **T07**: bullets 总计 ≥ 50 字，至少 2 条
   - **T10**: 左右各 ≥ 7 条 items，两张不同图片
   - **T12**: 每张卡片 description ≥ 80 中文字

### Phase 4.3: 全局风格确认 (Global Style Confirmation)

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

### Phase 4.4: 输出文档生成 (Output Documents)

根据 Phase 4.1-4.3 的设计决策，生成 3 个文档到 `videos/{name}/`：

**1. `section_outline.md` — 详细章节大纲：**

```markdown
# {主题} — 详细章节大纲

## 基本信息
- 总章节数: N
- 预估总时长: X分Y秒
- 目标时长: [来自 topic_definition.md]

## 章节大纲

### 1. hero — 开场引入
- **时间预算**: 12s (~45字)
- **内容范围**: [1个核心悬念/hook]
- **核心数据点**: [来自研究]
- **参考来源**: —
- **叙事目标**: 抓住注意力

### 2. {section_name} — {章节标题}
- **时间预算**: 10s (~40字, ≤20s)
- **内容范围**: [1个核心观点]
- **核心数据点**: [1-2个关键数据]
- **参考来源**: research_xxx.md
- **叙事目标**: [让观众记住什么]
```

**2. `section_density.md` — 密度分析：**

```markdown
# {主题} — 章节密度分析

## 密度分配总览
| # | 章节 | 密度 | 内容项数 | 预估字数 | TTS时长 | 占比 |
|---|------|------|---------|---------|--------|------|

## TTS 时长汇总
- 总旁白字数: N 字
- TTS 时长: N字 ÷ 270 × 60 × 1.15 = Xs
- 转场开销: 章节数 × 0.5s = Ys
- **预估总时长**: X + Y = Zs (Z分Z秒)
- 目标时长: [来自 topic_definition.md]
- 偏差: ±N%

## 密度平衡检查
- [ ] Impact 章节: N 个 (建议占比 10-20%)
- [ ] Standard 章节: N 个 (建议占比 50-70%)
- [ ] Compact 章节: N 个 (建议占比 10-30%)
- [ ] Dense 章节: N 个 (建议占比 0-10%)
- [ ] 所有章节 ≤ 20s，平均 ~10s
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

#### 素材引用
| 素材ID | 文件 | 用途 |
|--------|------|------|
| tokaiteio_scene | tokaiteio_scene.jpg | Timeline节点1配图 |
| tokaiteio_top | tokaiteio_top.png | Timeline节点2配图 |

#### 布局草图
┌──────────────────────────────────────┐
│  「{章节标题}」              72px    │
│                                      │
│  ┌──────┐  ┌──────┐  ┌──────┐       │
│  │ 🔒   │  │ 🔍   │  │ ⚡   │       │
│  │[img1] │  │      │  │      │       │
│  │ 特性1 │  │ 特性2 │  │ 特性3 │       │
│  └──────┘  └──────┘  └──────┘       │
└──────────────────────────────────────┘
```

**素材引用规则：**
- 无素材的 section（如纯 DataBar/StatCounter）省略 `#### 素材引用` 和 `#### 布局草图` 块
- 布局草图用 `[filename]` 标注图片位置，纯文字内容直接写
- 草图不需要精确到像素，表达相对位置和层级关系即可
- 素材 ID 对应 `media_manifest.json` 中的 `id` 字段，保持一致性
- Claude 在设计每个 section 时，应查阅 `media_manifest.json` 确认可用素材

### Phase 4.5: 验证与交付 (Validation)

生成文档后，执行以下验证清单：

| # | Check | Requirement |
|---|-------|-------------|
| 1 | 章节数量与节奏 | 总时长(s) ÷ 10 ≈ 章节数（±20%），**每页 ≤ 20s，平均 ~10s**，单页旁白 ≤ 80 字 |
| 2 | 布局多样性 | ≥3 种不同布局类型 |
| 3 | 背景交替 | 相邻章节背景色不同（outro 若使用动画/视频素材可豁免） |
| 4 | 密度平衡 | 根据章节数动态调整，保持 Impact/Standard/Compact 合理分布 |
| 5 | 时长匹配 | TTS 估算总时长在 Step 1 目标范围内（±15%） |
| 6 | 研究覆盖 | _index.md 建议章节主题均已覆盖 |
| 7 | 组件多样性 | 相邻章节不重复使用相同主要组件（同组件不同配置不算重复） |
| 8 | 排版层次 | 每个章节有 2+ 级文字大小 |
| 9 | 素材引用 | 有素材的章节在 section_ui.md 中包含 `#### 素材引用` 和 `#### 布局草图` |
| 10 | 素材ID一致 | section_ui.md 中的素材 ID 与 media_manifest.json 一致 |
| 11 | 模板内容约束 | 使用 T03/T05/T06/T07/T10/T12 的章节均满足对应模板的内容约束（见 SKILL.md "模板内容约束"表） |

**Step 4 完成条件：**

- [ ] Phase 4.1 章节蓝图已获用户确认
- [ ] Phase 4.2 所有内容章节已逐一获用户确认（含素材引用和布局草图）
- [ ] Phase 4.3 全局风格已获用户确认
- [ ] `section_outline.md` 已生成
- [ ] `section_density.md` 已生成
- [ ] `section_ui.md` 已生成（含素材引用和布局草图）
- [ ] Phase 4.5 验证清单全部通过

---

## Next Phase

Phase 1 完成。继续执行内容制作：

```
Read SKILL_phase2_production.md
```
