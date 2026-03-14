/**
 * 哈基米的发展 — Remotion Video Component
 * Marp-like clean aesthetic with warm peach/orange palette
 */

import React from "react";
import { Audio, staticFile, AbsoluteFill, Img } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import timing from "../../public/timing.json";
import type { VideoProps } from "./Root";

import {
  Scale4K,
  FullBleedLayout,
  PaddedLayout,
  useEntrance,
  getPresentation,
  ProgressBar,
  Timeline,
  FlowChart,
  StatCounter,
} from "./components";

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
  const sectionPadding = v ? "120px 60px" : "80px 100px";

  switch (section.name) {
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
              padding: v ? "0 60px" : "0 120px",
              ...animStyle,
            }}
          >
            <div style={{ fontSize: 120, marginBottom: 24 }}>🐱</div>
            <h1
              style={{
                fontSize: v ? 96 : 88,
                fontWeight: 800,
                color: props.primaryColor,
                lineHeight: 1.2,
              }}
            >
              哈基米的发展
            </h1>
            <div style={{
              width: 80, height: 2, marginTop: 24,
              background: props.primaryColor, opacity: 0.3,
            }} />
            <p
              style={{
                fontSize: v ? 40 : 36,
                color: props.textColor,
                marginTop: 20,
                opacity: 0.6,
                fontWeight: 500,
              }}
            >
              从蜂蜜到猫咪的互联网传奇
            </p>
          </div>
        </FullBleedLayout>
      );

    case "origin":
      return (
        <PaddedLayout bg="#fdf6f0" orientation={props.orientation}>
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
              起源
            </h2>
            <p style={{ fontSize: v ? 34 : 30, color: props.textColor, opacity: 0.5, marginTop: 8, marginBottom: v ? 48 : 40 }}>
              一切从一首蜂蜜之歌开始
            </p>
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                  <span style={{ fontSize: 36, flexShrink: 0 }}>🍯</span>
                  <div>
                    <span style={{ fontSize: 34, fontWeight: 700, color: props.primaryColor }}>はちみつ</span>
                    <span style={{ fontSize: 28, color: props.textColor, marginLeft: 12, opacity: 0.7 }}>日语"蜂蜜"的发音 → "哈基米"</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                  <span style={{ fontSize: 36, flexShrink: 0 }}>🐴</span>
                  <div>
                    <span style={{ fontSize: 34, fontWeight: 700, color: props.primaryColor }}>赛马娘 S2E12</span>
                    <span style={{ fontSize: 28, color: props.textColor, marginLeft: 12, opacity: 0.7 }}>东海帝王买蜂蜜水时哼唱</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                  <span style={{ fontSize: 36, flexShrink: 0 }}>🎵</span>
                  <div>
                    <span style={{ fontSize: 34, fontWeight: 700, color: props.primaryColor }}>魔性旋律</span>
                    <span style={{ fontSize: 28, color: props.textColor, marginLeft: 12, opacity: 0.7 }}>动画里很小的片段，却改变了一切</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PaddedLayout>
      );

    case "spread":
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
              B站爆发
            </h2>
            <p style={{ fontSize: v ? 34 : 30, color: props.textColor, opacity: 0.5, marginTop: 8, marginBottom: v ? 48 : 40 }}>
              京桥刹那的混剪改变了一切
            </p>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FlowChart
                props={props}
                steps={[
                  { icon: "🎬", label: "京桥刹那", description: "混剪东海帝王 + CLANNAD" },
                  { icon: "🔥", label: "B站走红", description: "鬼畜、翻唱、MAD 二创" },
                  { icon: "📢", label: "全站刷屏", description: "「哈基米」三字无处不在" },
                ]}
                delay={5}
              />
            </div>
          </div>
        </PaddedLayout>
      );

    case "cat_era":
      return (
        <PaddedLayout bg="#fdf6f0" orientation={props.orientation}>
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
              猫咪时代
            </h2>
            <p style={{ fontSize: v ? 34 : 30, color: props.textColor, opacity: 0.5, marginTop: 8, marginBottom: v ? 48 : 40 }}>
              2023年4月 · 抖音萌宠博主的意外发现
            </p>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Timeline
                props={props}
                items={[
                  { label: "配音猫咪视频", description: "抖音萌宠博主将哈基米调配在猫咪视频中" },
                  { label: "「米」≈「喵」", description: "网友将「哈基米」直接等同于猫咪的代名词" },
                  { label: "全网通用", description: "看到可爱的猫，评论区必刷「哈基米」" },
                  { label: "含义扩大", description: "一切可爱的小动物、甚至可爱的人都是「哈基米」" },
                ]}
                delay={5}
              />
            </div>
          </div>
        </PaddedLayout>
      );

    case "culture":
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
              文化影响
            </h2>
            <p style={{ fontSize: v ? 34 : 30, color: props.textColor, opacity: 0.5, marginTop: 8, marginBottom: v ? 48 : 36 }}>
              三次语义解构 · 跨平台传播
            </p>
            <div style={{ flex: 1, display: "flex", flexDirection: v ? "column" : "row", gap: v ? 32 : 48, alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <StatCounter
                  props={props}
                  items={[
                    { value: 3, suffix: "次", label: "语义解构", icon: "🔄" },
                    { value: 10, suffix: "大", label: "年度热梗", icon: "🏆" },
                  ]}
                  delay={5}
                />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ fontSize: 28, color: props.textColor, lineHeight: 1.8 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
                    <span style={{ fontWeight: 700, color: props.primaryColor }}>①</span>
                    <span>动画蜂蜜之歌</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
                    <span style={{ fontWeight: 700, color: props.primaryColor }}>②</span>
                    <span>萌宠代名词</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
                    <span style={{ fontWeight: 700, color: props.primaryColor }}>③</span>
                    <span>纯粹的网络文化符号</span>
                  </div>
                </div>
                <div style={{ fontSize: 24, color: props.textColor, opacity: 0.5 }}>
                  B站 → 抖音 → 微博 → 小红书 → 全网
                </div>
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
              一个梗能走多远，不取决于它本身的含义，
              <br />
              而取决于它被赋予了什么样的新含义。
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

export const Video = (props: VideoProps) => {
  const sections = timing.sections;
  const transitionFrames = props.transitionDuration;
  const transitionCount = Math.max(0, sections.length - 1);

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
