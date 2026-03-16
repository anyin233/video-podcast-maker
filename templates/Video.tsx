/**
 * Remotion Video Component Template - with Studio visual editing support
 *
 * Usage:
 * 1. Copy this file and components/ directory to your project src/
 * 2. Modify SectionComponent cases to match your sections
 * 3. Ensure timing.json and podcast_audio.wav are generated
 * 4. Use Remotion Studio right panel to adjust styles in real-time
 *
 * Available components (import from "./components"):
 *   ComparisonCard, Timeline, CodeBlock, QuoteBlock, FeatureGrid, DataBar, StatCounter, FlowChart, IconCard
 */

import React from "react";
import { Audio, staticFile, AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import timing from "../public/timing.json";
import type { VideoProps } from "./Root";

import {
  Scale4K,
  FullBleedLayout,
  PaddedLayout,
  useEntrance,
  getPresentation,
  ProgressBar,
} from "./components";

// Section renderer - customize your section visuals here
// Layouts auto-adapt based on orientation (horizontal/vertical)
const SectionComponent = ({
  section,
  props,
}: {
  section: typeof timing.sections[0];
  props: VideoProps;
}) => {
  const { opacity, translateY, scale } = useEntrance(props.enableAnimations);
  const animStyle = { opacity, transform: `translateY(${translateY}px) scale(${scale})` };
  const v = props.orientation === "vertical";
  // Vertical uses more padding top/bottom, less left/right
  const sectionPadding = v ? "120px 60px" : "80px 100px";

  switch (section.name) {
    // Reference font sizes (1080p design space, horizontal):
    // Hero title: 72-120px/800wt, Section title: 72-80px/700-800wt
    // Subtitle: 30-40px, Card title: 34-38px, Body: 26-34px, Tags: 20-26px
    // Vertical: scale up body/subtitle by ~20%, titles stay similar

    case "hero":
      return (
        <FullBleedLayout bg={props.backgroundColor}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: v ? "0 60px" : 0,
              ...animStyle,
            }}
          >
            <h1
              style={{
                fontSize: props.titleSize,
                fontWeight: 800,
                color: props.primaryColor,
                lineHeight: v ? 1.3 : 1.1,
              }}
            >
              视频标题
            </h1>
            {/* Thin horizontal rule */}
            <div style={{
              width: 80, height: 2, marginTop: v ? 28 : 20,
              background: props.primaryColor, opacity: 0.3,
            }} />
            <p
              style={{
                fontSize: props.subtitleSize,
                color: props.textColor,
                marginTop: v ? 28 : 16,
                opacity: 0.6,
                fontWeight: 500,
              }}
            >
              副标题或引导语
            </p>
          </div>
        </FullBleedLayout>
      );

    case "overview":
      return (
        <PaddedLayout bg={props.backgroundColor} orientation={props.orientation}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: sectionPadding,
              display: "flex",
              flexDirection: "column",
              ...animStyle,
            }}
          >
            <h2
              style={{
                fontSize: v ? 72 : 80,
                fontWeight: 700,
                marginBottom: 12,
                color: props.primaryColor,
              }}
            >
              今天的内容
            </h2>
            <p style={{ fontSize: v ? 34 : 30, color: props.textColor, opacity: 0.5, marginBottom: v ? 48 : 40 }}>
              Section description here
            </p>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%", maxWidth: v ? undefined : 900 }}>
                {[
                  { icon: "💡", title: "要点一", description: "说明文字" },
                  { icon: "🎯", title: "要点二", description: "说明文字" },
                  { icon: "✅", title: "要点三", description: "说明文字" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                    <span style={{ fontSize: v ? 36 : 32, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <span style={{ fontSize: v ? 34 : 32, fontWeight: 700, color: props.primaryColor }}>{item.title}</span>
                      <span style={{ fontSize: v ? 28 : 26, color: props.textColor, marginLeft: 12, opacity: 0.7 }}>{item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PaddedLayout>
      );

    case "summary":
      return (
        <FullBleedLayout bg={props.backgroundColor}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: sectionPadding,
              ...animStyle,
            }}
          >
            {/* Thin top divider */}
            <div style={{
              width: 60, height: 1, background: props.primaryColor, opacity: 0.2, marginBottom: 36,
            }} />
            <h2
              style={{
                fontSize: v ? 60 : 52,
                fontWeight: 700,
                color: props.primaryColor,
                marginBottom: 28,
                textAlign: "center",
              }}
            >
              总结
            </h2>
            <p
              style={{
                fontSize: v ? 36 : 30,
                color: props.textColor,
                lineHeight: 1.6,
                textAlign: "center",
                maxWidth: 800,
              }}
            >
              核心结论...
            </p>
          </div>
        </FullBleedLayout>
      );

    case "outro":
      return (
        <FullBleedLayout bg={props.backgroundColor}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              ...animStyle,
            }}
          >
            <h2
              style={{
                fontSize: v ? 72 : 80,
                fontWeight: 700,
                color: props.textColor,
                marginBottom: v ? 48 : 36,
              }}
            >
              感谢观看
            </h2>
            <p
              style={{
                fontSize: v ? 36 : 32,
                color: props.textColor,
                opacity: 0.5,
                fontWeight: 500,
              }}
            >
              点赞 / 收藏 / 关注
            </p>
            <p
              style={{
                fontSize: v ? 44 : 36,
                color: props.primaryColor,
                marginTop: v ? 48 : 36,
              }}
            >
              下期再见！
            </p>
          </div>
        </FullBleedLayout>
      );

    default:
      return (
        <PaddedLayout bg={props.backgroundColor} orientation={props.orientation}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: sectionPadding,
              display: "flex",
              flexDirection: "column",
              ...animStyle,
            }}
          >
            <h2
              style={{
                fontSize: v ? 72 : 80,
                fontWeight: 700,
                color: props.primaryColor,
              }}
            >
              {section.name}
            </h2>
            <p style={{ fontSize: v ? 34 : 30, color: props.textColor, opacity: 0.5, marginTop: 12 }}>
              Section description here
            </p>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 24,
              }}
            >
              <p
                style={{
                  fontSize: props.bodySize,
                  color: props.textColor,
                  fontWeight: 500,
                  lineHeight: v ? 1.8 : 1.5,
                  width: "100%",
                }}
              >
                Section content goes here...
              </p>
            </div>
          </div>
        </PaddedLayout>
      );
  }
};

// Main video component - receives editable props from Studio
export const Video = (props: VideoProps) => {
  const sections = timing.sections;
  const transitionFrames = props.transitionDuration;
  const transitionCount = Math.max(0, sections.length - 1);

  // Compensate for transition overlap: add lost frames to first section
  // so TransitionSeries total matches timing.total_frames for audio sync
  const compensatedSections = sections.map((s, i) => ({
    ...s,
    duration_frames: i === 0
      ? s.duration_frames + transitionCount * transitionFrames
      : s.duration_frames,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: props.backgroundColor }}>
      <Scale4K orientation={props.orientation}>
        <TransitionSeries>
          {compensatedSections.map((section, i) => (
            <React.Fragment key={section.name}>
              <TransitionSeries.Sequence durationInFrames={section.duration_frames}>
                <SectionComponent section={section} props={props} />
              </TransitionSeries.Sequence>
              {i < sections.length - 1 && transitionFrames > 0 && props.transitionType !== "none" && (
                <TransitionSeries.Transition
                  presentation={getPresentation(props.transitionType)}
                  timing={linearTiming({ durationInFrames: transitionFrames })}
                />
              )}
            </React.Fragment>
          ))}
        </TransitionSeries>
      </Scale4K>

      {/* Progress bar - minimal 4px line, outside scale(2) wrapper */}
      <ProgressBar props={props} />

      {/* BGM with configurable volume */}
      {props.bgmVolume > 0 && (
        <Audio src={staticFile("bgm.mp3")} volume={props.bgmVolume} />
      )}

      {/* TTS audio */}
      <Audio src={staticFile("podcast_audio.wav")} />
    </AbsoluteFill>
  );
};

export default Video;
