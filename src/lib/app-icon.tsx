import type { CSSProperties } from "react";

const shellStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "radial-gradient(circle at 28% 24%, rgba(255,245,229,0.95) 0%, rgba(255,245,229,0.2) 22%, rgba(255,245,229,0) 23%), linear-gradient(160deg, #d16c40 0%, #c85f32 46%, #8f3b21 100%)",
  color: "#fff7ef",
  position: "relative",
  overflow: "hidden",
  fontFamily: "Segoe UI, sans-serif",
};

const cardStyle: CSSProperties = {
  width: "68%",
  height: "68%",
  borderRadius: "24%",
  background: "linear-gradient(180deg, rgba(35,24,18,0.92) 0%, rgba(24,16,12,0.98) 100%)",
  boxShadow: "0 18px 40px rgba(65, 26, 9, 0.28), inset 0 1px 0 rgba(255,255,255,0.12)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
};

const accentStyle: CSSProperties = {
  position: "absolute",
  inset: "10%",
  borderRadius: "22%",
  border: "2px solid rgba(255,255,255,0.08)",
};

const letterStyle: CSSProperties = {
  fontSize: 148,
  fontWeight: 800,
  lineHeight: 1,
  letterSpacing: "-0.08em",
  transform: "translateX(8px)",
};

const dotStyle: CSSProperties = {
  position: "absolute",
  width: "16%",
  height: "16%",
  borderRadius: "999px",
  right: "19%",
  top: "19%",
  background: "#f0c35e",
  boxShadow: "0 0 0 6px rgba(240,195,94,0.16)",
};

export function AppIconArt() {
  return (
    <div style={shellStyle}>
      <div style={cardStyle}>
        <div style={accentStyle} />
        <div style={dotStyle} />
        <span style={letterStyle}>L</span>
      </div>
    </div>
  );
}
