import type { VideoProps } from "../Root";
import { useEntrance } from "./animations";

export const IconCard = ({
  props,
  icon,
  title,
  description,
  color,
  delay = 0,
}: {
  props: VideoProps;
  icon: string;
  title: string;
  description: string;
  color?: string;
  delay?: number;
}) => {
  const v = props.orientation === "vertical";
  const c = color || props.primaryColor;
  const a = useEntrance(props.enableAnimations, delay);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: v ? 28 : 32, width: "100%",
      padding: v ? "32px 36px" : "36px 44px",
      background: "transparent",
      borderRadius: 8,
      border: "1px solid rgba(0,0,0,0.08)",
      opacity: a.opacity, transform: `translateY(${a.translateY}px)`,
    }}>
      <div style={{
        fontSize: v ? 56 : 64, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: v ? 34 : 36, fontWeight: 700, color: c }}>
          {title}
        </div>
        <div style={{
          fontSize: v ? 26 : 24, color: props.textColor, marginTop: 8,
          lineHeight: 1.5, opacity: 0.75,
        }}>
          {description}
        </div>
      </div>
    </div>
  );
};
