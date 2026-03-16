import React from "react";
import { useCurrentFrame } from "remotion";
import type { VideoProps } from "../Root";
import timing from "../../../public/timing.json";

export const ProgressBar = ({ props }: { props: VideoProps }) => {
  const frame = useCurrentFrame();
  if (!props.showProgressBar) return null;

  const progress = (frame / timing.total_frames) * 100;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        background: "rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: props.progressColor,
        }}
      />
    </div>
  );
};

// Backward compatibility alias
export const ChapterProgressBar = ({
  props,
}: {
  props: VideoProps;
  chapters?: unknown;
}) => <ProgressBar props={props} />;
