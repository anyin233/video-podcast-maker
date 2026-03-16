---
name: video-podcast-maker-phase2
description: "Phase 2: Content Production — Script writing, publish info, thumbnails, TTS audio (Steps 5-8)"
type: phase
phase: 2
steps: "5-8"
prev: SKILL_phase1_planning.md
next: SKILL_phase3_video.md
---

# Phase 2: Content Production (Steps 5-8)

> **前置要求：** Phase 1 已完成，`section_outline.md`、`section_density.md`、`section_ui.md`、`media_manifest.json` 已生成。
> 共享规则见 `SKILL.md`（Technical Rules, Visual Design Minimums, Quality Checklists）。

---

## Step 5: Write Narration Script

**Claude behavior:** Before writing podcast.txt, read the following documents in order:
1. `videos/{name}/topic_definition.md` — 目标受众、视频风格、时长预期（决定语气和用词风格）
2. `videos/{name}/section_outline.md` — 章节名称、内容范围、核心数据点、叙事目标
3. `videos/{name}/section_density.md` — 每章节预估字数、TTS 时长、密度等级、节奏曲线
4. `videos/{name}/section_ui.md` — 章节名称须与 `[SECTION:xxx]` 标记完全一致；素材引用和布局草图指导视觉描述
5. `videos/{name}/research/_index.md` — 已验证的关键数据点
6. `videos/{name}/media_manifest.json` — 已收集的素材清单

**Per-Section Word Budget:**

使用 section_density.md 的预估字数列，为每章节计算精确旁白字数目标：

| 来源字段 | 公式 | 用途 |
|----------|------|------|
| section_density.md `预估字数` | 直接使用 | 每章节旁白字数上限 |
| section_density.md `TTS时长` | 字数 = 时长(s) × 270 ÷ 60 ÷ 1.15 | 反算验证 |

**⚠️ 单页节奏硬约束：** 每个 `[SECTION:xxx]` 对应一页 slide，旁白字数上限 **~80 字**（≤ 20s），平均 **~40 字**（~10s）。写作时逐章节检查字数，偏差控制在 ±15% 以内。超过 ±15% 时 Claude 自行增删内容调整，无需询问用户。**如果某章节字数超过 80 字，必须拆分为多个 `[SECTION:xxx]`。**

**语气与风格:**

根据 topic_definition.md 的视频风格调整：
- **严肃专业** → 书面用语、被动句式、少口语化
- **轻松幽默** → 口语化、比喻、反问句
- **快节奏** → 短句为主、省略过渡、直接给结论

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

**Iterative Dry-Run Loop:**

如果 dry-run 估算时长与 section_density.md 的预估总时长偏差 >15%，Claude 必须自行调整 podcast.txt 并重新 dry-run，直到偏差 ≤15%。无需询问用户。

**Step 5 质量检查清单:**

| # | Check | Requirement |
|---|-------|-------------|
| 1 | 章节完整性 | 所有 section_outline.md 章节均有对应 `[SECTION:xxx]` 标记 |
| 2 | 字数预算 | 每章节字数与 section_density.md 预估字数偏差 ≤15% |
| 3 | **单页字数上限** | **每个 `[SECTION:xxx]` 旁白 ≤ 80 字（≤ 20s），超过则必须拆分** |
| 4 | 数据点覆盖 | section_outline.md 的核心数据点在旁白中出现 |
| 5 | 中文数字 | 所有阿拉伯数字已转为中文读音 |
| 6 | 时长匹配 | dry-run 总时长与 section_density.md 预估总时长偏差 ≤15% |
| 7 | 风格一致 | 语气与 topic_definition.md 视频风格匹配 |

---

## Step 6: Generate Publish Info (Part 1)

**Claude behavior:** Before generating, read:
1. `videos/{name}/podcast.txt` — 旁白内容（提取关键词和亮点）
2. `videos/{name}/section_outline.md` — 章节标题和核心数据点
3. `videos/{name}/research/_index.md` — 调研概要

生成 `videos/{name}/publish_info.md`：

```markdown
# {主题} — 发布信息

## 标题
[数字 + 主题 + 吸引词，≤30字]
备选：[另一个标题方案]

## 标签 (10个)
产品名标签, 领域词标签, 热门标签...

## 简介 (100-200字)
[1句话概括视频内容 + 2-3个亮点 + 引导语]

## Part 2 待补充 (Step 13)
- [ ] B站章节时间戳
- [ ] 参考资料链接
```

**标题公式参考：**
- `{数字}个{主题}的{特点}，{结论/悬念}`
- `{主题}：{核心发现}`
- `{动词}{主题}，{结果}`

---

## Step 7: Generate Video Thumbnail

**询问用户选择封面生成方式**:
1. **Remotion生成** - 代码控制，风格与视频一致
2. **AI文生图（imagen skill）** - 使用 imagen skill 生成创意封面
3. **两者都生成** - 同时生成两种风格供选择

⚠️ **必须生成两个比例**: 16:9 (播放页) 和 4:3 (推荐流/动态)，缺一不可。9:16 仅在生成竖屏视频时需要。

**Claude behavior:** Read `videos/{name}/section_ui.md` 全局设计规范的配色方案（primaryColor, accentColor），确保封面用色与视频一致。对 AI 生成的封面，在 prompt 中明确指定这些颜色。

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

**Post-TTS 验证清单：**

| # | Check | Command / Method | Expected |
|---|-------|-----------------|----------|
| 1 | 音频文件 | `ls -lh videos/{name}/podcast_audio.wav` | 文件存在且 >0 bytes |
| 2 | 实际时长 | `ffprobe -v quiet -show_entries format=duration -of csv=p=0 videos/{name}/podcast_audio.wav` | 与 section_density.md 预估总时长偏差 ≤20% |
| 3 | timing.json 完整性 | 检查 sections 数量 | 等于 podcast.txt 中 `[SECTION:xxx]` 标记数量 |
| 4 | timing.json 连续性 | 每个 section 的 `start_frame` = 前一个的 `start_frame + duration_frames` | 无重叠无间隙 |
| 5 | SRT 编码 | `file videos/{name}/podcast_audio.srt` | UTF-8 encoding |
| 6 | SRT 条数 | 统计 SRT 序号数量 | >0，与旁白段落数大致匹配 |

---

## Next Phase

Phase 2 完成。继续执行视频制作：

```
Read SKILL_phase3_video.md
```
