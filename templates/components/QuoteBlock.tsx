import React from "react";
import type { VideoProps } from "../Root";
import { useEntrance } from "./animations";

export const QuoteBlock = ({
  props,
  quote,
  attribution,
  delay = 0,
}: {
  props: VideoProps;
  quote: string;
  attribution: string;
  delay?: number;
}) => {
  const anim = useEntrance(props.enableAnimations, delay);
  const attrAnim = useEntrance(props.enableAnimations, delay + 10);
  return (
    <div style={{
      width: "100%", padding: "40px 60px",
      opacity: anim.opacity, transform: `translateY(${anim.translateY}px)`,
      borderLeft: `3px solid ${props.primaryColor}`,
    }}>
      <p style={{
        fontSize: 40, fontWeight: 600, color: props.textColor,
        lineHeight: 1.6, fontStyle: "italic",
      }}>
        {quote}
      </p>
      <div style={{
        fontSize: 28, color: props.primaryColor, marginTop: 32, fontWeight: 500,
        opacity: attrAnim.opacity, transform: `translateY(${attrAnim.translateY}px)`,
      }}>
        &mdash; {attribution}
      </div>
    </div>
  );
};
