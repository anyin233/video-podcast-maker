/**
 * Remotion Root 组件模板 - 支持 Studio 可视化编辑
 *
 * 使用说明：
 * 1. 将此文件复制到项目的 src/ 目录
 * 2. 确保 Video.tsx 和 Thumbnail.tsx 已创建
 * 3. 确保 timing.json 已生成
 * 4. 运行 npx remotion studio 即可在右侧面板编辑样式
 */

import { Composition, Still } from "remotion";
import { z } from "zod";
import { Video } from "./Video";
// import { Thumbnail } from "./Thumbnail";
import timing from "../../public/timing.json";
import {
  Demo_T01, Demo_T02, Demo_T03, Demo_T04, Demo_T05, Demo_T06,
  Demo_T07, Demo_T08, Demo_T09, Demo_T10, Demo_T11, Demo_T12,
} from "./section-templates";

// 【可视化编辑】: Zod Schema 定义可编辑属性
// Remotion Studio 会自动根据类型生成对应的编辑 UI
export const videoSchema = z.object({
  // 颜色设置
  primaryColor: z.string().describe("主色调（标题、强调元素）"),
  backgroundColor: z.string().describe("背景色"),
  textColor: z.string().describe("正文文字颜色"),
  accentColor: z.string().describe("强调色（CTA、高亮）"),

  // 字体大小 (1080p design space, auto scale(2) to 4K)
  titleSize: z.number().min(72).max(120).describe("标题字号 (hero/section title)"),
  subtitleSize: z.number().min(30).max(68).describe("副标题字号"),
  bodySize: z.number().min(24).max(40).describe("正文字号"),

  // 进度条设置 (native 4K, outside scale(2))
  showProgressBar: z.boolean().describe("显示底部进度条"),
  progressColor: z.string().describe("进度条颜色"),

  // 音频设置
  bgmVolume: z.number().min(0).max(0.3).step(0.01).describe("BGM 音量"),

  // 动画设置
  enableAnimations: z.boolean().describe("启用入场动画"),

  // 转场设置
  transitionType: z.enum(["fade", "slide", "wipe", "none"]).describe("章节转场效果"),
  transitionDuration: z.number().min(0).max(30).describe("转场时长(帧数, 30帧=1秒)"),

  // 方向设置
  orientation: z.enum(["horizontal", "vertical"]).describe("视频方向: horizontal(16:9) / vertical(9:16)"),
});

// 类型导出，供 Video.tsx 使用
export type VideoProps = z.infer<typeof videoSchema>;

// 【可视化编辑】: 默认值 - Studio 会显示这些作为初始值
export const defaultVideoProps: VideoProps = {
  // 颜色 - Bright yellow/orange for 叮咚鸡 meme theme
  primaryColor: "#FFD700",
  backgroundColor: "#FFFFFF",
  textColor: "#333333",
  accentColor: "#FF6B35",

  // 字体大小 (1080p design space, auto scale(2) to 4K)
  // Reference: PluginComparison hero=72, Superpowers hero=120, section=80
  titleSize: 80,
  subtitleSize: 40,
  bodySize: 28,

  // 进度条 (minimal 4px line)
  showProgressBar: true,
  progressColor: "#FFD700",

  // 音频
  bgmVolume: 0.05,

  // 动画
  enableAnimations: true,

  // 转场
  transitionType: "fade",
  transitionDuration: 15,

  // 方向
  orientation: "horizontal",
};

// 视频 ID
const VIDEO_ID = "MyVideo";

export const RemotionRoot = () => {
  return (
    <>
      {/* 主视频 - 4K 分辨率，支持可视化编辑 */}
      <Composition
        id={VIDEO_ID}
        component={Video}
        durationInFrames={timing.total_frames}
        fps={30}
        width={3840}
        height={2160}
        schema={videoSchema}
        defaultProps={defaultVideoProps}
      />

      {/* Vertical video - 9:16 for B站竖屏/短视频 */}
      <Composition
        id="MyVideoVertical"
        component={Video}
        durationInFrames={timing.total_frames}
        fps={30}
        width={2160}
        height={3840}
        schema={videoSchema}
        defaultProps={{
          ...defaultVideoProps,
          orientation: "vertical",
          showProgressBar: false,
          titleSize: 96,
          subtitleSize: 48,
          bodySize: 36,
        }}
      />

      {/* Thumbnails disabled - add Thumbnail.tsx first */}

      {/* ── Section Template Showcase ── */}
      {/* Render: npx remotion still src/remotion/index.ts T01_HeroSplit out.png --frame=60 */}
      <Composition id="T01-HeroSplit" component={Demo_T01} durationInFrames={90} fps={30} width={3840} height={2160} />
      <Composition id="T02-PhotoOverlay" component={Demo_T02} durationInFrames={90} fps={30} width={3840} height={2160} />
      <Composition id="T03-ImageGrid" component={Demo_T03} durationInFrames={90} fps={30} width={3840} height={2160} />
      <Composition id="T04-QuotePortrait" component={Demo_T04} durationInFrames={90} fps={30} width={3840} height={2160} />
      <Composition id="T05-SplitDataViz" component={Demo_T05} durationInFrames={90} fps={30} width={3840} height={2160} />
      <Composition id="T06-TimelineMedia" component={Demo_T06} durationInFrames={90} fps={30} width={3840} height={2160} />
      <Composition id="T07-MagazineSpread" component={Demo_T07} durationInFrames={90} fps={30} width={3840} height={2160} />
      <Composition id="T08-StepByStep" component={Demo_T08} durationInFrames={90} fps={30} width={3840} height={2160} />
      <Composition id="T09-BigNumber" component={Demo_T09} durationInFrames={90} fps={30} width={3840} height={2160} />
      <Composition id="T10-DualCompare" component={Demo_T10} durationInFrames={90} fps={30} width={3840} height={2160} />
      <Composition id="T11-FeaturedImage" component={Demo_T11} durationInFrames={90} fps={30} width={3840} height={2160} />
      <Composition id="T12-BannerCards" component={Demo_T12} durationInFrames={90} fps={30} width={3840} height={2160} />
    </>
  );
};
