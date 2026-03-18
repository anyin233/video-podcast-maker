# Video Podcast Maker

![header](assets/readme-header.png)

[English](README_EN.md)

用自然语言描述主题，自动生成 B站风格的知识视频。集成调研、脚本、TTS、Remotion 渲染、字幕和 BGM 混音，全流程自动化。

```
"帮我做一个关于 xxx 的视频" → 10分钟 4K 成品
```

## 快速开始

**前置条件：** Node.js 18+ / Python 3.8+ / FFmpeg

```bash
# 1. 创建 Remotion 项目
npx create-video@latest my-video && cd my-video && npm i

# 2. 安装 TTS 依赖（三选一）
pip install edge-tts                          # 免费，无需密钥
pip install azure-cognitiveservices-speech     # Azure（需 API Key）
pip install dashscope                         # CosyVoice（需 API Key）

# 3. 在 Claude Code 中直接说
"帮我制作一个关于 [你的主题] 的视频播客"
```

## 工作流

```
主题 → 调研 → 脚本(podcast.txt) → TTS音频 → Remotion渲染 → BGM混音 → 字幕烧录 → 4K成品
```

| 步骤 | 产出 |
|------|------|
| 调研 & 大纲 | `research/*.md`, `section_outline.md` |
| 脚本 | `podcast.txt`（带 `[SECTION:xxx]` 标记） |
| TTS | `podcast_audio.wav` + `timing.json` + `.srt` |
| 渲染 | 3840x2160 HEVC，`output.mp4` |
| 后处理 | BGM混音 → 字幕烧录 → `final_video.mp4` |

## 核心特性

- **三种 TTS 引擎** — Azure / CosyVoice / Edge TTS（免费）
- **4K HEVC** — 硬件加速，macOS VideoToolbox / Linux NVENC
- **13 种章节模板** — HeroSplit / PhotoOverlay / BigNumber / Timeline / DualCompare 等
- **Remotion Studio** — 实时预览 + 可视化调色/排版
- **字幕** — 严格按标点断句，句号强制换行
- **B站优化** — 一键三连片尾、16:9+4:3 双封面、章节时间戳

## 模板速览

| 模板 | 用途 | 模板 | 用途 |
|------|------|------|------|
| T01 HeroSplit | 左文右图开场 | T08 StepByStep | 流程步骤 |
| T02 PhotoOverlay | 全屏图+文字叠层 | T09 BigNumber | 冲击力数字 |
| T03 ImageGrid | 2x2 图文卡片 | T10 DualCompare | A vs B 对比 |
| T04 QuotePortrait | 名言+头像 | T11 FeaturedImage | 大图展示 |
| T05 SplitDataViz | 数据条+图片 | T12 BannerCards | 横幅+卡片 |
| T06 TimelineMedia | 时间线+缩略图 | T13 FullVideo | 全屏视频 |
| T07 MagazineSpread | 大图+要点列表 | | |

## 环境变量

```bash
# TTS（三选一）
export TTS_BACKEND="edge"                    # 免费，无需配置
export AZURE_SPEECH_KEY="xxx"                # Azure TTS
export DASHSCOPE_API_KEY="xxx"               # CosyVoice

# 可选
export GEMINI_API_KEY="xxx"                  # AI 封面生成
```

## 常用命令

```bash
npx remotion studio src/remotion/index.ts                    # 实时预览
python3 generate_tts.py -i videos/xxx/podcast.txt -o videos/xxx --dry-run  # 预估时长
python3 generate_tts.py -i videos/xxx/podcast.txt -o videos/xxx            # 生成音频
npx remotion render src/remotion/index.ts MyVideo videos/xxx/output.mp4 --codec h265  # 渲染
```

## 开源协议

MIT

## 作者

**Agents365-ai** · [B站](https://space.bilibili.com/441831884) · [GitHub](https://github.com/Agents365-ai)
