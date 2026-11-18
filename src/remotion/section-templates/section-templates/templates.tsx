import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";

const FONT = "PingFang SC, Noto Sans SC, -apple-system, sans-serif";

const fadeIn = (
  frame: number,
  delay = 0,
  dur = 25,
): React.CSSProperties => ({
  opacity: interpolate(frame, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }),
  transform: `translateY(${interpolate(frame, [delay, delay + dur], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
});

// ─────────────────────────────────────────────────────────────
// T01  HeroSplit  —  60 / 40 split, title left, image right
// ─────────────────────────────────────────────────────────────
export interface T01Props {
  title: string;
  subtitle: string;
  description?: string;
  tags?: string[];
  image: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export const T01_HeroSplit: React.FC<T01Props> = (p) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: p.backgroundColor, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "58%", padding: "80px 70px", display: "flex", flexDirection: "column", justifyContent: "center", ...fadeIn(f) }}>
        <div style={{ width: 48, height: 5, backgroundColor: p.accentColor, borderRadius: 3, marginBottom: 24 }} />
        <h1 style={{ fontSize: 85, fontWeight: 800, color: p.primaryColor, lineHeight: 1.15, margin: 0 }}>{p.title}</h1>
        <p style={{ fontSize: 39, fontWeight: 600, color: p.textColor, opacity: 0.75, margin: "24px 0 0", lineHeight: 1.45 }}>{p.subtitle}</p>
        {p.description && <p style={{ fontSize: 29, color: p.textColor, opacity: 0.5, margin: "24px 0 0", lineHeight: 1.6 }}>{p.description}</p>}
        {p.tags && (
          <div style={{ display: "flex", gap: 12, marginTop: 24, ...fadeIn(f, 10) }}>
            {p.tags.map((t, i) => (
              <span key={i} style={{ fontSize: 23, color: p.accentColor, background: `${p.accentColor}1A`, padding: "8px 20px", borderRadius: 100, fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", right: 40, top: 40, bottom: 40, width: "38%", borderRadius: 16, overflow: "hidden", ...fadeIn(f, 8) }}>
        <Img src={staticFile(p.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// T02  PhotoOverlay  —  Full-bleed image + text overlay card
// ─────────────────────────────────────────────────────────────
export interface T02Props {
  title: string;
  subtitle: string;
  caption?: string;
  image: string;
  overlayColor?: string;
}

export const T02_PhotoOverlay: React.FC<T02Props> = (p) => {
  const f = useCurrentFrame();
  const oc = p.overlayColor ?? "rgba(0,0,0,0.55)";
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Img src={staticFile(p.image)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${oc}, transparent 70%)` }} />
      <div style={{ position: "absolute", bottom: 80, left: 80, right: 80, ...fadeIn(f, 5) }}>
        <h1 style={{ fontSize: 81, fontWeight: 800, color: "#fff", lineHeight: 1.15, margin: 0, textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>{p.title}</h1>
        <div style={{ width: 60, height: 4, background: "#fff", borderRadius: 2, margin: "20px 0" }} />
        <p style={{ fontSize: 37, fontWeight: 500, color: "rgba(255,255,255,0.88)", margin: 0, lineHeight: 1.5 }}>{p.subtitle}</p>
        {p.caption && <p style={{ fontSize: 27, color: "rgba(255,255,255,0.6)", margin: "14px 0 0", ...fadeIn(f, 15) }}>{p.caption}</p>}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// T03  ImageGrid  —  2×2 card grid with image + text
// CONSTRAINT: `items` must have exactly 4 entries.
//             Each item's `description` must be ≥20 Chinese characters.
// ─────────────────────────────────────────────────────────────
export interface T03Props {
  title: string;
  subtitle?: string;
  items: Array<{ image: string; title: string; description: string }>;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
}

export const T03_ImageGrid: React.FC<T03Props> = (p) => {
  const f = useCurrentFrame();
  const items = p.items.slice(0, 4);
  return (
    <AbsoluteFill style={{ backgroundColor: p.backgroundColor, fontFamily: FONT, padding: "40px 50px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 20, ...fadeIn(f) }}>
        <h2 style={{ fontSize: 69, fontWeight: 800, color: p.primaryColor, margin: 0 }}>{p.title}</h2>
        {p.subtitle && <p style={{ fontSize: 29, color: p.textColor, opacity: 0.5, margin: 0 }}>{p.subtitle}</p>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24, flex: 1 }}>
        {items.map((item, i) => (
          <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", display: "flex", flexDirection: "row", ...fadeIn(f, 6 + i * 5) }}>
            <div style={{ width: "45%", overflow: "hidden", flexShrink: 0 }}>
              <Img src={staticFile(item.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h3 style={{ fontSize: 33, fontWeight: 700, color: p.primaryColor, margin: 0 }}>{item.title}</h3>
              <p style={{ fontSize: 25, color: p.textColor, opacity: 0.65, margin: "6px 0 0", lineHeight: 1.4 }}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// T04  QuotePortrait  —  Decorative quote + circular portrait
// ─────────────────────────────────────────────────────────────
export interface T04Props {
  quote: string;
  author: string;
  role?: string;
  portrait: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export const T04_QuotePortrait: React.FC<T04Props> = (p) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: p.backgroundColor, fontFamily: FONT, padding: "80px 90px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {/* decorative mark */}
      <div style={{ position: "absolute", top: 60, left: 70, fontSize: 220, fontFamily: "Georgia, serif", color: p.accentColor, opacity: 0.08, lineHeight: 1 }}>&ldquo;</div>
      <div style={{ borderLeft: `4px solid ${p.accentColor}`, paddingLeft: 40, maxWidth: 1400, ...fadeIn(f) }}>
        <p style={{ fontSize: 47, fontWeight: 600, color: p.textColor, lineHeight: 1.55, fontStyle: "italic", margin: 0 }}>{p.quote}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 48, ...fadeIn(f, 12) }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, overflow: "hidden", border: `3px solid ${p.accentColor}`, flexShrink: 0 }}>
          <Img src={staticFile(p.portrait)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div>
          <p style={{ fontSize: 35, fontWeight: 700, color: p.primaryColor, margin: 0 }}>{p.author}</p>
          {p.role && <p style={{ fontSize: 27, color: p.textColor, opacity: 0.55, margin: "4px 0 0" }}>{p.role}</p>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// T05  SplitDataViz  —  Data bars left + image right
// CONSTRAINT: Only use when real, verified data is available.
//             Do NOT fabricate or estimate bar values.
// ─────────────────────────────────────────────────────────────
export interface T05Props {
  title: string;
  subtitle?: string;
  bars: Array<{ label: string; value: number; maxValue?: number }>;
  image: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export const T05_SplitDataViz: React.FC<T05Props> = (p) => {
  const f = useCurrentFrame();
  const maxVal = Math.max(...p.bars.map((b) => b.maxValue ?? b.value));
  return (
    <AbsoluteFill style={{ backgroundColor: p.backgroundColor, fontFamily: FONT, padding: "60px 70px" }}>
      <h2 style={{ fontSize: 69, fontWeight: 800, color: p.primaryColor, margin: 0, ...fadeIn(f) }}>{p.title}</h2>
      {p.subtitle && <p style={{ fontSize: 29, color: p.textColor, opacity: 0.5, margin: "8px 0 0", ...fadeIn(f, 3) }}>{p.subtitle}</p>}
      <div style={{ display: "flex", gap: 48, marginTop: 40, flex: 1, alignItems: "center" }}>
        {/* Data */}
        <div style={{ flex: 1.2, display: "flex", flexDirection: "column", gap: 22, ...fadeIn(f, 6) }}>
          {p.bars.map((bar, i) => {
            const pct = (bar.value / maxVal) * 100;
            const fill = interpolate(f, [15 + i * 6, 40 + i * 6], [0, pct], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 29, fontWeight: 600, color: p.textColor }}>{bar.label}</span>
                  <span style={{ fontSize: 29, fontWeight: 700, color: p.primaryColor }}>{bar.value}%</span>
                </div>
                <div style={{ height: 18, background: "rgba(0,0,0,0.06)", borderRadius: 9 }}>
                  <div style={{ height: "100%", width: `${fill}%`, background: p.accentColor, borderRadius: 9 }} />
                </div>
              </div>
            );
          })}
        </div>
        {/* Image */}
        <div style={{ flex: 1, borderRadius: 16, overflow: "hidden", height: "80%", ...fadeIn(f, 10) }}>
          <Img src={staticFile(p.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// T06  TimelineMedia  —  Vertical timeline with thumbnails + detail + right image
// CONSTRAINT: Timeline use only. Each event `label`: 20–40 Chinese chars;
//             each `description`: 30–50 Chinese chars. `events` length is flexible.
// ─────────────────────────────────────────────────────────────
export interface T06Props {
  title: string;
  subtitle?: string;
  events: Array<{ image: string; label: string; description: string; detail?: string; tags?: string[] }>;
  sideImage?: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export const T06_TimelineMedia: React.FC<T06Props> = (p) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: p.backgroundColor, fontFamily: FONT, padding: "50px 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, ...fadeIn(f) }}>
        <div>
          <h2 style={{ fontSize: 65, fontWeight: 800, color: p.primaryColor, margin: 0 }}>{p.title}</h2>
          {p.subtitle && <p style={{ fontSize: 29, color: p.textColor, opacity: 0.5, margin: "6px 0 0" }}>{p.subtitle}</p>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 40, flex: 1 }}>
        {/* timeline */}
        <div style={{ flex: 1.3, display: "flex", flexDirection: "column", gap: 0 }}>
          {p.events.map((ev, i) => (
            <div key={i} style={{ display: "flex", gap: 20, ...fadeIn(f, 6 + i * 6) }}>
              <div style={{ width: 100, height: 100, borderRadius: 12, overflow: "hidden", flexShrink: 0, border: `2px solid ${p.accentColor}` }}>
                <Img src={staticFile(ev.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20 }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, background: p.accentColor, flexShrink: 0, marginTop: 42 }} />
                {i < p.events.length - 1 && <div style={{ width: 2, flex: 1, background: `${p.accentColor}25`, minHeight: 14 }} />}
              </div>
              <div style={{ flex: 1, paddingBottom: 18 }}>
                <h3 style={{ fontSize: 35, fontWeight: 700, color: p.primaryColor, margin: 0 }}>{ev.label}</h3>
                <p style={{ fontSize: 27, color: p.textColor, opacity: 0.75, margin: "4px 0 0", lineHeight: 1.45 }}>{ev.description}</p>
                {ev.detail && <p style={{ fontSize: 25, color: p.textColor, opacity: 0.5, margin: "4px 0 0", lineHeight: 1.4 }}>{ev.detail}</p>}
                {ev.tags && (
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    {ev.tags.map((t, j) => (
                      <span key={j} style={{ fontSize: 21, color: p.accentColor, background: `${p.accentColor}10`, padding: "2px 10px", borderRadius: 10, fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* side image */}
        {p.sideImage && (
          <div style={{ flex: 0.7, borderRadius: 16, overflow: "hidden", ...fadeIn(f, 10) }}>
            <Img src={staticFile(p.sideImage)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// T07  MagazineSpread  —  Large image left + content right
// CONSTRAINT: Total text across all `bullets` must be ≥50 Chinese characters.
//             `bullets` must have ≥2 entries (bullet-point presentation required).
// ─────────────────────────────────────────────────────────────
export interface T07Props {
  title: string;
  subtitle?: string;
  bullets: string[];
  image: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export const T07_MagazineSpread: React.FC<T07Props> = (p) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: p.backgroundColor, fontFamily: FONT }}>
      {/* left image */}
      <div style={{ position: "absolute", left: 40, top: 40, bottom: 40, width: "55%", borderRadius: 16, overflow: "hidden", ...fadeIn(f, 3) }}>
        <Img src={staticFile(p.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {/* right content */}
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "42%", padding: "70px 60px 70px 30px", display: "flex", flexDirection: "column", justifyContent: "center", ...fadeIn(f, 8) }}>
        <div style={{ width: 40, height: 4, background: p.accentColor, borderRadius: 2, marginBottom: 24 }} />
        <h2 style={{ fontSize: 61, fontWeight: 800, color: p.primaryColor, lineHeight: 1.2, margin: 0 }}>{p.title}</h2>
        {p.subtitle && <p style={{ fontSize: 31, color: p.textColor, opacity: 0.6, margin: "16px 0 0", lineHeight: 1.5 }}>{p.subtitle}</p>}
        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
          {p.bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, ...fadeIn(f, 14 + i * 5) }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: p.accentColor, marginTop: 12, flexShrink: 0 }} />
              <p style={{ fontSize: 29, color: p.textColor, opacity: 0.8, margin: 0, lineHeight: 1.55 }}>{b}</p>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// T08  StepByStep  —  Numbered steps with illustrations + metrics
// ─────────────────────────────────────────────────────────────
export interface T08Props {
  title: string;
  subtitle?: string;
  steps: Array<{ image: string; label: string; description: string; metric?: string; metricLabel?: string }>;
  summary?: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export const T08_StepByStep: React.FC<T08Props> = (p) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: p.backgroundColor, fontFamily: FONT, padding: "50px 60px" }}>
      <div style={{ textAlign: "center", ...fadeIn(f) }}>
        <h2 style={{ fontSize: 65, fontWeight: 800, color: p.primaryColor, margin: 0 }}>{p.title}</h2>
        {p.subtitle && <p style={{ fontSize: 29, color: p.textColor, opacity: 0.5, margin: "6px 0 0" }}>{p.subtitle}</p>}
      </div>
      <div style={{ display: "flex", gap: 0, marginTop: 32, flex: 1, alignItems: "center", justifyContent: "center" }}>
        {p.steps.map((step, i) => (
          <React.Fragment key={i}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", ...fadeIn(f, 8 + i * 6) }}>
              <div style={{ width: 270, height: 270, borderRadius: 135, overflow: "hidden", border: `3px solid ${p.accentColor}20`, marginBottom: 16 }}>
                <Img src={staticFile(step.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: p.accentColor, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 21, fontWeight: 800, color: "#fff" }}>{i + 1}</span>
              </div>
              <h3 style={{ fontSize: 33, fontWeight: 700, color: p.primaryColor, margin: 0 }}>{step.label}</h3>
              <p style={{ fontSize: 25, color: p.textColor, opacity: 0.65, margin: "6px 0 0", lineHeight: 1.45, maxWidth: 350, minHeight: 52 }}>{step.description}</p>
              {step.metric && (
                <div style={{ marginTop: 12, padding: "8px 20px", borderRadius: 8, border: `1px solid rgba(0,0,0,0.08)` }}>
                  <span style={{ fontSize: 31, fontWeight: 800, color: p.accentColor }}>{step.metric}</span>
                  {step.metricLabel && <span style={{ fontSize: 21, color: p.textColor, opacity: 0.5, marginLeft: 6 }}>{step.metricLabel}</span>}
                </div>
              )}
            </div>
            {i < p.steps.length - 1 && (
              <div style={{ fontSize: 64, fontWeight: 700, color: p.accentColor, padding: "0 2px", marginTop: 60 }}>→</div>
            )}
          </React.Fragment>
        ))}
      </div>
      {p.summary && (
        <div style={{ textAlign: "center", padding: "14px 0", borderTop: "1px solid rgba(0,0,0,0.06)", ...fadeIn(f, 30) }}>
          <p style={{ fontSize: 27, color: p.textColor, opacity: 0.6, margin: 0 }}>{p.summary}</p>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// T09  BigNumber  —  Giant stat over muted background image
// ─────────────────────────────────────────────────────────────
export interface T09Props {
  number: string;
  suffix?: string;
  label: string;
  description?: string;
  image: string;
  overlayColor?: string;
}

export const T09_BigNumber: React.FC<T09Props> = (p) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [5, 35], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Img src={staticFile(p.image)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.4) blur(2px)" }} />
      <div style={{ position: "absolute", inset: 0, background: p.overlayColor ?? "rgba(0,0,0,0.45)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ...fadeIn(f, 3) }}>
        <div style={{ transform: `scale(${scale})`, display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 165, fontWeight: 900, color: "#fff", letterSpacing: -4, lineHeight: 1 }}>{p.number}</span>
          {p.suffix && <span style={{ fontSize: 57, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{p.suffix}</span>}
        </div>
        <p style={{ fontSize: 41, fontWeight: 600, color: "rgba(255,255,255,0.9)", margin: "16px 0 0", letterSpacing: 2, ...fadeIn(f, 12) }}>{p.label}</p>
        {p.description && <p style={{ fontSize: 29, color: "rgba(255,255,255,0.6)", margin: "12px 0 0", maxWidth: 800, textAlign: "center", lineHeight: 1.5, ...fadeIn(f, 18) }}>{p.description}</p>}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// T10  DualCompare  —  Side-by-side with image headers + stats + verdict
// CONSTRAINT: `left.items` and `right.items` must each have ≥7 entries.
//             `left.image` and `right.image` must be two different image files.
// ─────────────────────────────────────────────────────────────
export interface T10Props {
  title: string;
  subtitle?: string;
  left: { image: string; title: string; subtitle?: string; stat?: string; statLabel?: string; items: string[]; highlight?: boolean };
  right: { image: string; title: string; subtitle?: string; stat?: string; statLabel?: string; items: string[]; highlight?: boolean };
  verdict?: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export const T10_DualCompare: React.FC<T10Props> = (p) => {
  const f = useCurrentFrame();
  const renderCol = (col: T10Props["left"], delay: number) => (
    <div style={{ flex: 1, borderRadius: 12, overflow: "hidden", border: `1px solid rgba(0,0,0,0.08)`, background: col.highlight ? `${p.accentColor}06` : "transparent", display: "flex", flexDirection: "column", ...fadeIn(f, delay) }}>
      <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
        <Img src={staticFile(col.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {col.stat && (
          <div style={{ position: "absolute", bottom: 10, right: 14, background: "rgba(0,0,0,0.65)", borderRadius: 8, padding: "4px 12px", display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 29, fontWeight: 800, color: "#fff" }}>{col.stat}</span>
            {col.statLabel && <span style={{ fontSize: 19, color: "rgba(255,255,255,0.7)" }}>{col.statLabel}</span>}
          </div>
        )}
      </div>
      <div style={{ padding: "20px 24px", flex: 1 }}>
        <h3 style={{ fontSize: 37, fontWeight: 700, color: p.primaryColor, margin: 0 }}>{col.title}</h3>
        {col.subtitle && <p style={{ fontSize: 25, color: p.textColor, opacity: 0.5, margin: "4px 0 0" }}>{col.subtitle}</p>}
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {col.items.map((item, i) => (
            <div key={i} style={{ fontSize: 26, color: p.textColor, opacity: 0.75, paddingTop: i > 0 ? 8 : 0, borderTop: i > 0 ? "1px solid rgba(0,0,0,0.05)" : "none", lineHeight: 1.4 }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: p.backgroundColor, fontFamily: FONT, padding: "44px 56px" }}>
      <div style={{ textAlign: "center", ...fadeIn(f) }}>
        <h2 style={{ fontSize: 61, fontWeight: 800, color: p.primaryColor, margin: 0 }}>{p.title}</h2>
        {p.subtitle && <p style={{ fontSize: 27, color: p.textColor, opacity: 0.5, margin: "4px 0 0" }}>{p.subtitle}</p>}
      </div>
      <div style={{ display: "flex", gap: 28, marginTop: 28, flex: 1 }}>
        {renderCol(p.left, 6)}
        <div style={{ display: "flex", alignItems: "center", ...fadeIn(f, 10) }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: p.accentColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 25, fontWeight: 800, color: "#fff" }}>VS</span>
          </div>
        </div>
        {renderCol(p.right, 12)}
      </div>
      {p.verdict && (
        <div style={{ textAlign: "center", padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.06)", marginTop: 8, ...fadeIn(f, 24) }}>
          <p style={{ fontSize: 27, color: p.textColor, opacity: 0.55, margin: 0, fontStyle: "italic" }}>{p.verdict}</p>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// T11  FeaturedImage  —  Single hero image with elegant frame
// USAGE: Only for image-showcase sections (product screenshots, diagrams, photos).
//        Do NOT use for text-heavy content sections.
// ─────────────────────────────────────────────────────────────
export interface T11Props {
  title: string;
  caption: string;
  tag?: string;
  image: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export const T11_FeaturedImage: React.FC<T11Props> = (p) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: p.backgroundColor, fontFamily: FONT, padding: "50px 70px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, ...fadeIn(f) }}>
        {p.tag && <span style={{ fontSize: 23, fontWeight: 600, color: p.accentColor, background: `${p.accentColor}12`, padding: "4px 14px", borderRadius: 16 }}>{p.tag}</span>}
        <h2 style={{ fontSize: 61, fontWeight: 800, color: p.primaryColor, margin: 0 }}>{p.title}</h2>
      </div>
      <div style={{ flex: 1, width: "85%", marginTop: 28, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", ...fadeIn(f, 6) }}>
        <Img src={staticFile(p.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <p style={{ fontSize: 29, color: p.textColor, opacity: 0.55, margin: "20px 0 0", textAlign: "center", maxWidth: 900, lineHeight: 1.5, ...fadeIn(f, 12) }}>{p.caption}</p>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// T12  BannerCards  —  Top image banner + rich info cards below
// CONSTRAINT: Each card's `description` must be ≥80 Chinese characters
//             (English: ≥160 Latin characters for equivalent visual length).
// ─────────────────────────────────────────────────────────────
export interface T12Props {
  title: string;
  subtitle?: string;
  bannerImage: string;
  cards: Array<{ icon: string; title: string; value: string; description?: string; trend?: string }>;
  footnote?: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export const T12_BannerCards: React.FC<T12Props> = (p) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: p.backgroundColor, fontFamily: FONT }}>
      {/* banner image — compact */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "34%", overflow: "hidden", ...fadeIn(f, 2) }}>
        <Img src={staticFile(p.bannerImage)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.65))" }} />
        <div style={{ position: "absolute", bottom: 20, left: 56 }}>
          <h2 style={{ fontSize: 55, fontWeight: 800, color: "#fff", margin: 0, textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>{p.title}</h2>
          {p.subtitle && <p style={{ fontSize: 27, color: "rgba(255,255,255,0.75)", margin: "4px 0 0" }}>{p.subtitle}</p>}
        </div>
      </div>
      {/* cards — height driven by tallest card content, not stretched to bottom */}
      <div style={{ position: "absolute", top: "36%", left: 44, right: 44, display: "flex", gap: 18, alignItems: "stretch" }}>
        {p.cards.map((card, i) => (
          <div key={i} style={{ flex: 1, borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", padding: "24px 22px", display: "flex", flexDirection: "column", ...fadeIn(f, 10 + i * 4) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 38 }}>{card.icon}</span>
              {card.trend && <span style={{ fontSize: 24, fontWeight: 700, color: card.trend.startsWith("+") || card.trend.startsWith("↑") ? "#27ae60" : p.accentColor }}>{card.trend}</span>}
            </div>
            <span style={{ fontSize: 43, fontWeight: 800, color: p.primaryColor, marginTop: 10 }}>{card.value}</span>
            <span style={{ fontSize: 27, fontWeight: 600, color: p.textColor, opacity: 0.75, marginTop: 6 }}>{card.title}</span>
            {card.description && <span style={{ fontSize: 29, color: p.textColor, opacity: 0.55, marginTop: 10, lineHeight: 1.5 }}>{card.description}</span>}
          </div>
        ))}
      </div>
      {p.footnote && <p style={{ position: "absolute", bottom: 12, left: 56, fontSize: 22, color: p.textColor, opacity: 0.3 }}>{p.footnote}</p>}
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// T13  FullVideo  —  Full-screen video playback
// ─────────────────────────────────────────────────────────────
export interface T13Props {
  video?: string;
  label?: string;
  backgroundColor?: string;
}

export const T13_FullVideo: React.FC<T13Props> = (p) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: p.backgroundColor ?? "#000", fontFamily: FONT }}>
      {p.video ? (
        <OffthreadVideo src={staticFile(p.video)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#1A1A1A", ...fadeIn(f) }}>
          <div style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 0, height: 0, borderTop: "24px solid transparent", borderBottom: "24px solid transparent", borderLeft: "40px solid rgba(255,255,255,0.5)", marginLeft: 8 }} />
          </div>
          <span style={{ fontSize: 28, fontWeight: 500, color: "rgba(255,255,255,0.25)", marginTop: 16 }}>{p.label ?? "Full-Screen Video"}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
