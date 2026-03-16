---
name: video-podcast-maker-phase3
description: "Phase 3: Video Production & Publishing — Remotion composition, render, BGM, subtitles, publish info, verification, cleanup (Steps 9-15)"
type: phase
phase: 3
steps: "9-15"
prev: SKILL_phase2_production.md
next: null
---

# Phase 3: Video Production & Publishing (Steps 9-15)

> **前置要求：** Phase 2 已完成，`podcast_audio.wav`、`timing.json`、`media_manifest.json` 已生成。
> 共享规则见 `SKILL.md`（Technical Rules, Visual Design Minimums, Quality Checklists）。

---

## Step 9: Create Remotion Composition + Studio Preview

复制文件到 public/:
```bash
cp videos/{name}/podcast_audio.wav videos/{name}/timing.json public/
```

**Claude behavior:** Before writing Remotion composition code, read:
1. `videos/{name}/section_ui.md` — 每章节的组件、布局、背景色、动画、字号、差异化说明
2. `videos/{name}/section_outline.md` — 章节名称、叙事目标（决定视觉重心）
3. `videos/{name}/section_density.md` — 密度等级（决定内容项数和文字大小）
4. `videos/{name}/media_manifest.json` — 每章节素材文件列表（决定 staticFile 引用）

**逐章节组件映射流程：**

对 section_ui.md 中的每个章节，按以下步骤创建 `SectionComponent` 的 switch case：

1. 读取该章节的 `组件` 字段 → 从 `./components` 导入对应组件
2. 读取该章节的 `布局` 字段 → 使用 `FullBleedLayout` 或 `PaddedLayout`
3. 读取该章节的 `背景色` 字段 → 设为布局的 `bg` prop
4. 读取该章节的 `动画` 字段 → 配置 `useEntrance` / stagger
5. 读取该章节的 `字号` 字段 → 设置具体 fontSize 值
6. 读取 media_manifest.json 该章节的 `assets` → 用 `staticFile()` 引用素材

**Root.tsx defaultProps 映射：**

section_ui.md 全局设计规范 → Root.tsx `defaultVideoProps`：

| section_ui.md 字段 | Root.tsx prop |
|-------------------|--------------|
| primaryColor | `primaryColor` |
| backgroundColor | `backgroundColor` |
| textColor | `textColor` |
| accentColor | `accentColor` |
| 转场效果 | `transitionType` |
| 转场时长 | `transitionDuration` |

使用 `timing.json` 驱动章节时长同步。

**SectionComponent 代码示例：**

以下展示 3 个典型组件的 switch-case 写法，覆盖不同密度级别。Claude 应参考此模式为所有章节生成对应 case。

```tsx
import {
  Scale4K, FullBleedLayout, PaddedLayout,
  useEntrance, getPresentation, ProgressBar,
  FeatureGrid, ComparisonCard, DataBar,
} from "./components";

// --- FeatureGrid 示例 (Compact 密度, 3×2 网格) ---
case "tech_features":
  return (
    <PaddedLayout bg="#FFFFFF" orientation={props.orientation}>
      <div style={{ position: "absolute", inset: 0, padding: sectionPadding, display: "flex", flexDirection: "column", ...animStyle }}>
        <h2 style={{ fontSize: 72, fontWeight: 700, color: props.primaryColor, marginBottom: 12 }}>
          核心技术
        </h2>
        <p style={{ fontSize: 30, color: props.textColor, opacity: 0.5, marginBottom: 40 }}>
          Rust 区别于其他语言的核心特性
        </p>
        <FeatureGrid
          columns={3}
          items={[
            { icon: "🔒", title: "所有权系统", description: "编译期内存安全" },
            { icon: "🔍", title: "借用检查器", description: "零运行时开销" },
            { icon: "⚡", title: "零成本抽象", description: "单态化泛型" },
            { icon: "🚀", title: "无 GC", description: "零暂停延迟" },
            { icon: "🔗", title: "安全并发", description: "Send/Sync traits" },
            { icon: "✨", title: "async closures", description: "Edition 2024" },
          ]}
          primaryColor={props.primaryColor}
          textColor={props.textColor}
        />
      </div>
    </PaddedLayout>
  );

// --- ComparisonCard 示例 (Standard 密度, 2列对比) ---
case "vs_cpp":
  return (
    <PaddedLayout bg="#FFFFFF" orientation={props.orientation}>
      <div style={{ position: "absolute", inset: 0, padding: sectionPadding, display: "flex", flexDirection: "column", ...animStyle }}>
        <h2 style={{ fontSize: 72, fontWeight: 700, color: props.primaryColor, marginBottom: 40 }}>
          Rust vs C++
        </h2>
        <ComparisonCard
          left={{ title: "Rust", items: ["编译期内存安全", "Cargo 统一工具链", "10年生态快速增长"] }}
          right={{ title: "C++", items: ["运行时工具检测", "CMake/Conan 碎片化", "40+年深厚生态"] }}
          primaryColor={props.primaryColor}
          textColor={props.textColor}
        />
      </div>
    </PaddedLayout>
  );

// --- DataBar 示例 (Standard 密度, 水平条形图) ---
case "vs_go_python":
  return (
    <PaddedLayout bg="#F5F5F5" orientation={props.orientation}>
      <div style={{ position: "absolute", inset: 0, padding: sectionPadding, display: "flex", flexDirection: "column", ...animStyle }}>
        <h2 style={{ fontSize: 72, fontWeight: 700, color: props.primaryColor, marginBottom: 40 }}>
          Rust vs Go/Python
        </h2>
        <DataBar
          items={[
            { label: "执行速度 (req/s)", values: [{ name: "Rust", value: 95 }, { name: "Go", value: 63 }, { name: "Python", value: 8 }] },
            { label: "内存占用 (MB)", values: [{ name: "Rust", value: 65 }, { name: "Go", value: 210 }, { name: "Python", value: 380 }] },
          ]}
          primaryColor={props.primaryColor}
          accentColor={props.accentColor}
          textColor={props.textColor}
        />
      </div>
    </PaddedLayout>
  );
```

**注意：** 以上代码仅为参考模式。实际项目中，数据来自 section_outline.md，颜色来自 section_ui.md，组件 props 参考 `templates/components/` 中各组件的 TypeScript 接口。

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

**Step 9 组件集成检查清单：**

| # | Check | Requirement |
|---|-------|-------------|
| 1 | 章节完整性 | timing.json 中每个 section 都有对应 switch case |
| 2 | UI 一致性 | 每个 case 的组件/布局/背景色与 section_ui.md 一致 |
| 3 | 配色映射 | Root.tsx defaultVideoProps 的颜色与 section_ui.md 全局规范一致 |
| 4 | 素材引用 | media_manifest.json 中的文件都用 staticFile() 正确引用 |
| 5 | 组件导入 | 所有使用的组件都在 import 语句中 |
| 6 | 方向适配 | 每个 case 都处理 `props.orientation` 竖屏适配 |
| 7 | Studio 预览 | `npx remotion studio` 启动后所有章节可正常显示 |

---

## Step 10: Render Video

> Use `npx remotion studio` for preview, then render directly for final output.
> **默认使用 H.265 (HEVC) 编码** — 更高压缩比，更小文件体积，B站原生支持。

### 10.0 渲染前硬件加速检测

**Claude behavior:** 渲染前必须执行硬件加速检测脚本（见 SKILL.md §0.1.1），确认 HEVC 编码器可用性。检测结果决定 FFmpeg 后处理步骤的编码器选择。

```bash
echo "=== 渲染前硬件加速检测 ==="
OS=$(uname -s)
HWACCEL_ENCODER="libx265"
HWACCEL_OPTS="-crf 18 -preset slow"
if [ "$OS" = "Darwin" ] && ffmpeg -hide_banner -encoders 2>/dev/null | grep -q hevc_videotoolbox; then
  HWACCEL_ENCODER="hevc_videotoolbox"
  HWACCEL_OPTS="-q:v 55"
  echo "✓ 使用 macOS VideoToolbox 硬件加速 (hevc_videotoolbox)"
elif [ "$OS" = "Linux" ] && ffmpeg -hide_banner -encoders 2>/dev/null | grep -q hevc_nvenc; then
  HWACCEL_ENCODER="hevc_nvenc"
  HWACCEL_OPTS="-cq 20 -preset p5"
  echo "✓ 使用 NVIDIA NVENC 硬件加速 (hevc_nvenc)"
elif [ "$OS" = "Linux" ] && ffmpeg -hide_banner -encoders 2>/dev/null | grep -q hevc_vaapi; then
  HWACCEL_ENCODER="hevc_vaapi"
  HWACCEL_OPTS="-qp 22"
  echo "✓ 使用 VAAPI 硬件加速 (hevc_vaapi)"
else
  echo "⚠ 无硬件加速，使用软件编码 (libx265 -crf 18 -preset slow)"
fi
echo "HEVC Encoder: $HWACCEL_ENCODER $HWACCEL_OPTS"
```

### 10.1 渲染横屏 4K 视频

```bash
npx remotion render src/remotion/index.ts CompositionId videos/{name}/output.mp4 \
  --codec h265 --video-bitrate 16M --hardware-acceleration if-possible
```

**验证 4K + HEVC**:
```bash
ffprobe -v quiet -show_entries stream=width,height,codec_name -of csv=p=0 videos/{name}/output.mp4
# 期望: hevc,3840,2160 (或 h265,3840,2160)
```

### Optional: Render Vertical Highlight Clip (9:16)

Generate a 60-90 second vertical video for B站竖屏/短视频, using the same audio and components.

```bash
# Render vertical version (uses MyVideoVertical composition, H.265 + hardware acceleration)
npx remotion render src/remotion/index.ts MyVideoVertical videos/{name}/output_vertical.mp4 \
  --codec h265 --video-bitrate 16M --hardware-acceleration if-possible

# Render 9:16 thumbnail
npx remotion still src/remotion/index.ts Thumbnail9x16 videos/{name}/thumbnail_remotion_9x16.png

# Verify
ffprobe -v quiet -show_entries stream=width,height,codec_name -of csv=p=0 videos/{name}/output_vertical.mp4
# 期望: hevc,2160,3840
```

The vertical composition reuses the same Video.tsx component with `orientation: "vertical"`. All section layouts, components (ComparisonCard, FeatureGrid, etc.), and Scale4K automatically adapt for 9:16.

---

## Step 11: Mix with Background Music

> BGM 混音仅操作音频流，视频流直接复制（`-c:v copy`），保留原始 H.265 编码不变。

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

> 字幕烧录需重新编码视频流。使用 Step 10.0 检测到的 HEVC 编码器（`$HWACCEL_ENCODER`）。

**macOS 硬件加速版本（默认，使用 VideoToolbox）：**
```bash
ffmpeg -y -i videos/{name}/video_with_bgm.mp4 \
  -vf "subtitles=videos/{name}/podcast_audio.srt:force_style='FontName=PingFang SC,FontSize=14,PrimaryColour=&H00333333,OutlineColour=&H00FFFFFF,Bold=1,Outline=2,Shadow=0,MarginV=20'" \
  -c:v hevc_videotoolbox -q:v 55 -tag:v hvc1 -s 3840x2160 \
  -c:a copy videos/{name}/final_video.mp4
```

**软件编码回退版本（无硬件加速时）：**
```bash
ffmpeg -y -i videos/{name}/video_with_bgm.mp4 \
  -vf "subtitles=videos/{name}/podcast_audio.srt:force_style='FontName=PingFang SC,FontSize=14,PrimaryColour=&H00333333,OutlineColour=&H00FFFFFF,Bold=1,Outline=2,Shadow=0,MarginV=20'" \
  -c:v libx265 -crf 18 -preset slow -tag:v hvc1 -s 3840x2160 \
  -c:a copy videos/{name}/final_video.mp4
```

**Claude behavior:** 根据 Step 10.0 检测结果自动选择对应命令。优先使用硬件加速版本。

**关键参数**:
- `-s 3840x2160` — 强制 4K
- `-tag:v hvc1` — Apple/B站兼容的 HEVC tag
- `hevc_videotoolbox -q:v 55` — macOS 硬件加速（质量值越低质量越高，55 约等于 CRF 18）
- `libx265 -crf 18 -preset slow` — 软件编码回退，高质量

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

# 编码 (期望 HEVC/H.265)
CODEC=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$VIDEO_DIR/final_video.mp4")
if [ "$CODEC" = "hevc" ]; then
  echo "✓ 视频编码: H.265 (HEVC)"
else
  echo "⚠ 视频编码: $CODEC (期望 hevc/H.265)"
fi

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
✓ 编码: H.265 (HEVC)
✓ 硬件加速: VideoToolbox / NVENC / 软件编码
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

## Workflow Complete

所有 15 步已完成。最终产出：
- `videos/{name}/final_video.mp4` — 可直接上传 B站的 4K 视频
- `videos/{name}/publish_info.md` — 标题、标签、简介、章节时间戳
- `videos/{name}/thumbnail_*` — 16:9 + 4:3 封面图
