import { PAGE_META, IMG_HERO } from "../utils/trafficHelpers";

export default function Hero({ activePage }) {
  const meta = PAGE_META[activePage] || PAGE_META.dashboard;
  return (
    <div className="hero">
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url('${IMG_HERO}')`,
        backgroundSize: "cover", backgroundPosition: "center",
      }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(28,28,28,0.62)" }} />
      <div className="hero-content" style={{ position: "relative", zIndex: 2 }}>
        <div className="hero-badge">
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8fcf93", animation: "pulse 2s infinite" }} />
          Données J-1 · Capteurs actifs
        </div>
        <div className="hero-title">{meta.title}</div>
        <div className="hero-sub">{meta.sub}</div>
      </div>
    </div>
  );
}
