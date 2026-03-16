/**
 * 叮咚鸡 — Remotion Video Component
 * Meme culture documentary: the rise of "Ding Dong Chicken" from obscure audio clip to global phenomenon.
 * Palette: yellow #FFD700 / orange #FF8C00 / white #FFFFFF / accent #FF6B35
 */

import React from "react";
import { Audio, staticFile, AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import timing from "../../public/timing.json";
import type { VideoProps } from "./Root";

import {
  T01_HeroSplit,
  T02_PhotoOverlay,
  T03_ImageGrid,
  T05_SplitDataViz,
  T06_TimelineMedia,
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

/** Silent sections (e.g. outro with is_silent: true) receive 150 extra frames. */
const SILENT_EXTRA_FRAMES = 150;

/**
 * Renders the correct section template based on section.name from timing.json.
 * Each case maps to one of the 12 predefined templates (T01-T12) with
 * content specific to the 叮咚鸡 video.
 */
const SectionComponent = ({
  section,
  props,
}: {
  section: (typeof timing.sections)[0];
  props: VideoProps;
}) => {
  switch (section.name) {
    // ── hero: Full-bleed image with text overlay (T02) ──
    case "hero":
      return (
        <T02_PhotoOverlay
          title="你一定听过这只鸡"
          subtitle="叮咚鸡 · 大狗叫 · 袋鼠鸡 · 见缸马"
          image="media/dingdong-chicken/hero_chicken.png"
          overlayColor="rgba(0,0,0,0.50)"
        />
      );

    // ── origin: Vertical timeline with side image (T06) ──
    case "origin":
      return (
        <T06_TimelineMedia
          title="一切从一个大喇叭开始"
          events={[
            {
              image: "media/dingdong-chicken/origin_timeline_1.png",
              label: "2022.3 · 社区大喇叭",
              description: "印尼社区魔性广播，洗脑旋律初现",
            },
            {
              image: "media/dingdong-chicken/origin_timeline_2.png",
              label: "2022.3 · 空耳爆红",
              description: "「叮咚鸡叮咚鸡」空耳席卷中文互联网",
            },
            {
              image: "media/dingdong-chicken/origin_family.png",
              label: "2022.8 · 神曲诞生",
              description: "多版本混剪涌现，叮咚鸡家族成型",
            },
          ]}
          sideImage="media/dingdong-chicken/origin_megaphone.png"
          primaryColor={props.primaryColor}
          backgroundColor="#FFF3E0"
          textColor={props.textColor}
          accentColor={props.accentColor}
        />
      );

    // ── first_wave: 2x2 image grid showing platform spread (T03) ──
    case "first_wave":
      return (
        <T03_ImageGrid
          title="听不懂但是会唱了"
          items={[
            {
              image: "media/dingdong-chicken/first_wave_weibo.png",
              title: "微博热搜",
              description: "话题阅读量破千万，全民跟唱",
            },
            {
              image: "media/dingdong-chicken/first_wave_douyin.png",
              title: "抖音爆火",
              description: "500万+播放，BGM席卷短视频",
            },
            {
              image: "media/dingdong-chicken/first_wave_bilibili.png",
              title: "B站鬼畜",
              description: "二创井喷，鬼畜区狂欢",
            },
            {
              image: "media/dingdong-chicken/first_wave_music.png",
              title: "音乐平台上架",
              description: "QQ音乐/网易云多平台正式发行",
            },
          ]}
          primaryColor={props.primaryColor}
          backgroundColor="#FFFFFF"
          textColor={props.textColor}
        />
      );

    // ── explosion: Magazine spread — large image left, bullets right (T07) ──
    case "explosion":
      return (
        <T07_MagazineSpread
          title="叮咚鸡宇宙大爆炸"
          bullets={[
            "鬼畜混剪 — 加速、变调、混音，把一首歌玩出一百种花样",
            "AI角色化 — 拟人化动画角色，叮咚鸡有了自己的形象",
            "DJ串烧 — ×《越打越年轻》等经典，跨界联动停不下来",
            "正式发行 — QQ音乐/Apple Music/Spotify全平台上架",
          ]}
          image="media/dingdong-chicken/explosion_remix.png"
          primaryColor="#FFFFFF"
          backgroundColor="#FF8C00"
          textColor="#FFFFFF"
          accentColor="#FFD700"
        />
      );

    // ── controversy: Data bars left + image right (T05) ──
    case "controversy":
      return (
        <T05_SplitDataViz
          title="你以为限流了我就完了？"
          bars={[
            { label: "平台限流", value: 85, maxValue: 100 },
            { label: "版权纠纷", value: 70, maxValue: 100 },
            { label: "安全争议", value: 60, maxValue: 100 },
            { label: "AI伦理", value: 50, maxValue: 100 },
          ]}
          image="media/dingdong-chicken/controversy_car.png"
          primaryColor={props.primaryColor}
          backgroundColor="#F5F5F5"
          textColor={props.textColor}
          accentColor={props.accentColor}
        />
      );

    // ── evolution: Three numbered steps with circular images (T08) ──
    case "evolution":
      return (
        <T08_StepByStep
          title="打不死的小强…不，小鸡"
          steps={[
            {
              image: "media/dingdong-chicken/evolution_gaming.png",
              label: "游戏化",
              description: "节奏游戏、小程序，叮咚鸡变身互动玩法",
              metric: "7.8亿",
              metricLabel: "播放量",
            },
            {
              image: "media/dingdong-chicken/evolution_global.png",
              label: "国际化",
              description: "走出国门，硬控老外，全球传播",
            },
            {
              image: "media/dingdong-chicken/evolution_scholar.png",
              label: "哲学化",
              description: "哈耶克名言加持，从玩梗到文化解读",
            },
          ]}
          primaryColor={props.primaryColor}
          backgroundColor="#FFF8E1"
          textColor={props.textColor}
          accentColor={props.accentColor}
        />
      );

    // ── meme_status: Giant stat over muted background (T09) ──
    case "meme_status":
      return (
        <T09_BigNumber
          number="7.8亿"
          label="抖音累计播放量"
          description="高适应性迷因的典型案例"
          image="media/dingdong-chicken/meme_status_globe.png"
        />
      );

    // ── summary: 60/40 hero split (T01) ──
    case "summary":
      return (
        <T01_HeroSplit
          title="为什么一只鸡能打败所有人"
          subtitle="空耳魔力 · 低门槛二创 · 多次翻红 · 情感记忆"
          image="media/dingdong-chicken/summary_crown.png"
          primaryColor={props.primaryColor}
          backgroundColor="#FFD700"
          textColor={props.textColor}
          accentColor={props.accentColor}
        />
      );

    // ── outro: Call-to-action hero split (T01) ──
    case "outro":
      return (
        <T01_HeroSplit
          title="一键三连！"
          subtitle="点赞 · 投币 · 收藏"
          image="media/dingdong-chicken/outro_chicken.png"
          primaryColor={props.primaryColor}
          backgroundColor="#FFFFFF"
          textColor={props.textColor}
          accentColor={props.accentColor}
        />
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

/**
 * Main video composition for the 叮咚鸡 episode.
 *
 * Renders a TransitionSeries driven by timing.json section data,
 * with ProgressBar outside Scale4K at native 4K resolution, and
 * audio tracks for TTS narration and optional BGM.
 */
export const Video = (props: VideoProps) => {
  const sections = timing.sections;
  const transitionFrames = props.transitionDuration;
  const transitionCount = Math.max(0, sections.length - 1);

  /**
   * Compensate for transition overlap by adding lost frames to the first section.
   * Silent sections (is_silent: true) get SILENT_EXTRA_FRAMES additional frames.
   */
  const compensatedSections = sections.map((s, i) => ({
    ...s,
    duration_frames:
      (i === 0
        ? s.duration_frames + transitionCount * transitionFrames
        : s.duration_frames) +
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
