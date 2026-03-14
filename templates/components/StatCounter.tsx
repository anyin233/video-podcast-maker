import React from "react";
import type { VideoProps } from "../Root";
import { useEntrance, useCounter } from "./animations";

export const StatCounter = ({
  props,
  items,
  delay = 0,
}: {
  props: VideoProps;
  items: { value: number; suffix?: string; label: string; icon?: string }[];
  delay?: number;
}) => {
  const v = props.orientation === "vertical";
  return (
    <div style={{
      display: "flex", gap: v ? 32 : 48, width: "100%",
      flexDirection: v ? "column" : "row", justifyContent: "center",
    }}>
      {items.map((item, i) => {
        const a = useEntrance(props.enableAnimations, delay + i * 8);
        const count = useCounter(item.value, delay + i * 8 + 5);
        return (
          <div key={i} style={{
            flex: v ? undefined : 1, textAlign: "center",
            padding: v ? "28px 36px" : "36px 24px",
            background: "transparent",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.08)",
            opacity: a.opacity, transform: `translateY(${a.translateY}px)`,
          }}>
            {item.icon && <div style={{ fontSize: v ? 48 : 52, marginBottom: 12 }}>{item.icon}</div>}
            <div style={{
              fontSize: v ? 56 : 64, fontWeight: 800, color: props.primaryColor,
              letterSpacing: -2,
            }}>
              {count}{item.suffix || ""}
            </div>
            <div style={{
              fontSize: v ? 26 : 24, fontWeight: 500, color: props.textColor,
              marginTop: 8, opacity: 0.65,
            }}>
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
