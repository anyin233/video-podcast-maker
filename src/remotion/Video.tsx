/**
 * OpenClaw 自我介绍视频 — Remotion Video Component
 * 9 sections, ~10s pacing, purple/green tech theme
 * Templates: T01, T02, T03, T07, T08, T09 + custom outro
 */

import React from "react";
import { Audio, staticFile, AbsoluteFill, OffthreadVideo } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import timing from "../../public/timing.json";
import type { VideoProps } from "./Root";

import {
  T01_HeroSplit,
  T02_PhotoOverlay,
  T03_ImageGrid,
  T07_MagazineSpread,
  T08_StepByStep,
  T09_BigNumber,
} from "./section-templates";

import {
  Scale4K,
  ProgressBar,
  getPresentation,
} from "./components";

const FONT = "'PingFang SC', 'Noto Sans SC', -apple-system, sans-serif";
const SILENT_EXTRA_FRAMES = 150;
const M = "media/openclaw-intro";

const SectionComponent = ({
  section,
  props,
}: {
  section: (typeof timing.sections)[0];
  props: VideoProps;
}) => {
  switch (section.name) {

    // ═══════════════════════════════════════
    //  1. HERO — T02 PhotoOverlay
    // ═══════════════════════════════════════
    case "hero":
      return (
        <T02_PhotoOverlay
          title="你正在看的这个视频"
          subtitle="是 AI 自己做的"
          caption="从调研、写稿、配音到渲染——全自动"
          image={`${M}/readme_header.png`}
          overlayColor="rgba(0,0,0,0.55)"
        />
      );

    // ═══════════════════════════════════════
    //  2. PAIN POINTS — T01 HeroSplit
    // ═══════════════════════════════════════
    case "pain_points":
      return (
        <T01_HeroSplit
          title="做视频，太累了"
          subtitle="调研、写稿、配音、剪辑、字幕、封面……每个环节都耗时耗力"
          description="很多创作者还没开始就已经放弃"
          image={`${M}/pain_points_ai.png`}
          primaryColor="#E53935"
          backgroundColor="#FFF5F5"
          textColor="#333333"
          accentColor="#C62828"
        />
      );

    // ═══════════════════════════════════════
    //  3. WHAT IS — T09 BigNumber
    // ═══════════════════════════════════════
    case "what_is":
      return (
        <T09_BigNumber
          number="1"
          suffix="句话"
          label="从输入到 4K 成品的距离"
          description="OpenClaw — 用自然语言驱动全流程自动化"
          image={`${M}/what_is_ai.png`}
          overlayColor="rgba(108,92,231,0.65)"
        />
      );

    // ═══════════════════════════════════════
    //  4. WORKFLOW — T08 StepByStep
    // ═══════════════════════════════════════
    case "workflow":
      return (
        <T08_StepByStep
          title="十五步全自动流水线"
          subtitle="从零到成品，一气呵成"
          steps={[
            {
              image: `${M}/hero_ai.png`,
              label: "深度调研",
              description: "多轮网络搜索与资料验证",
            },
            {
              image: `${M}/what_is_ai.png`,
              label: "脚本写作",
              description: "自动生成分章节旁白脚本",
            },
            {
              image: `${M}/tts_render_ai.png`,
              label: "TTS 配音",
              description: "三种引擎可选，含免费方案",
            },
            {
              image: `${M}/workflow_ai.png`,
              label: "视频渲染",
              description: "Remotion 4K HEVC 硬件加速",
            },
            {
              image: `${M}/templates_ai.png`,
              label: "后处理",
              description: "BGM 混音 + 字幕烧录",
            },
          ]}
          primaryColor="#6C5CE7"
          backgroundColor="#FFFFFF"
          textColor="#2D3436"
          accentColor="#00B894"
        />
      );

    // ═══════════════════════════════════════
    //  5. TEMPLATES — T03 ImageGrid
    // ═══════════════════════════════════════
    case "templates":
      return (
        <T03_ImageGrid
          title="十三种视觉模板"
          subtitle="每页都有设计感"
          items={[
            {
              image: `${M}/hero_ai.png`,
              title: "全屏大图 + 文字叠层",
              description: "用于开场和氛围渲染，背景图搭配渐变蒙版和大标题",
            },
            {
              image: `${M}/templates_ai.png`,
              title: "数据对比 + 图文卡片",
              description: "适合多特性展示和案例对比，内置动态条形图和统计组件",
            },
            {
              image: `${M}/workflow_ai.png`,
              title: "步骤流程 + 时间线",
              description: "编号步骤配合大圆图，带指标展示，适合方法论和流程类内容",
            },
            {
              image: `${M}/recursion_ai.png`,
              title: "杂志风 + 引用卡片",
              description: "左侧大图右侧要点列表，以及带头像的名言引用，适合深度内容",
            },
          ]}
          primaryColor="#6C5CE7"
          backgroundColor="#F8F7FF"
          textColor="#2D3436"
        />
      );

    // ═══════════════════════════════════════
    //  6. TTS + RENDER — T07 MagazineSpread
    // ═══════════════════════════════════════
    case "tts_render":
      return (
        <T07_MagazineSpread
          title="声音与画面"
          subtitle="专业级音视频输出"
          bullets={[
            "三种 TTS 引擎：Azure 高品质、CosyVoice 中文优化、Edge TTS 完全免费",
            "4K HEVC 输出（3840×2160），macOS 和 Linux 硬件加速渲染",
            "自动生成 SRT 字幕，支持多音字校正和语速调节",
            "B站深度优化：一键三连片尾、双比例封面、章节时间戳",
          ]}
          image={`${M}/tts_render_ai.png`}
          primaryColor="#6C5CE7"
          backgroundColor="#FFFFFF"
          textColor="#2D3436"
          accentColor="#00B894"
        />
      );

    // ═══════════════════════════════════════
    //  7. RECURSION — T02 PhotoOverlay (purple)
    // ═══════════════════════════════════════
    case "recursion":
      return (
        <T02_PhotoOverlay
          title="对，你正在看的这个视频"
          subtitle="就是用 OpenClaw 做的"
          caption="如果它连介绍自己都能做好——你的视频它也行"
          image={`${M}/recursion_ai.png`}
          overlayColor="rgba(108,92,231,0.6)"
        />
      );

    // ═══════════════════════════════════════
    //  8. HOW TO START — T08 StepByStep
    // ═══════════════════════════════════════
    case "how_to_start":
      return (
        <T08_StepByStep
          title="三步开始你的第一个视频"
          steps={[
            {
              image: `${M}/how_to_start_ai.png`,
              label: "安装环境",
              description: "Node.js + Python + FFmpeg",
              metric: "3",
              metricLabel: "个依赖",
            },
            {
              image: `${M}/what_is_ai.png`,
              label: "打开 OpenClaw",
              description: "安装并启动自动视频制作工具",
            },
            {
              image: `${M}/hero_ai.png`,
              label: "说出你的主题",
              description: "「帮我做一个关于 xxx 的视频」",
              metric: "1",
              metricLabel: "句话",
            },
          ]}
          summary="就这么简单。"
          primaryColor="#00B894"
          backgroundColor="#F0FFF4"
          textColor="#2D3436"
          accentColor="#6C5CE7"
        />
      );

    // ═══════════════════════════════════════
    //  9. OUTRO — Custom bilibili triple
    // ═══════════════════════════════════════
    case "outro":
      return (
        <AbsoluteFill style={{ backgroundColor: "#FFFFFF", fontFamily: FONT }}>
          <OffthreadVideo
            src={staticFile(`${M}/bilibili-triple-white.mp4`)}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </AbsoluteFill>
      );

    default:
      return (
        <AbsoluteFill
          style={{
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
          }}
        >
          <h2 style={{ fontSize: 72, fontWeight: 700, color: props.primaryColor }}>
            {section.name}
          </h2>
        </AbsoluteFill>
      );
  }
};

export const Video = (props: VideoProps) => {
  const sections = timing.sections;
  const transitionFrames = props.transitionDuration;

  const compensatedSections = sections.map((s, i) => ({
    ...s,
    duration_frames:
      s.duration_frames +
      (i < sections.length - 1 ? transitionFrames : 0) +
      (s.is_silent ? SILENT_EXTRA_FRAMES : 0),
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: props.backgroundColor, fontFamily: FONT }}>
      <Scale4K orientation={props.orientation}>
        <TransitionSeries>
          {compensatedSections.map((section, i) => (
            <React.Fragment key={section.name}>
              <TransitionSeries.Sequence
                durationInFrames={section.duration_frames}
              >
                <SectionComponent section={section} props={props} />
              </TransitionSeries.Sequence>
              {i < sections.length - 1 &&
                transitionFrames > 0 &&
                props.transitionType !== "none" && (
                  <TransitionSeries.Transition
                    presentation={getPresentation(props.transitionType)}
                    timing={linearTiming({
                      durationInFrames: transitionFrames,
                    })}
                  />
                )}
            </React.Fragment>
          ))}
        </TransitionSeries>
      </Scale4K>

      <ProgressBar props={props} />

      {props.bgmVolume > 0 && (
        <Audio src={staticFile("bgm.mp3")} volume={props.bgmVolume} />
      )}

      <Audio src={staticFile("podcast_audio.wav")} />
    </AbsoluteFill>
  );
};

export default Video;
