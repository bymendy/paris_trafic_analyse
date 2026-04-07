import { C } from "../utils/trafficHelpers";

export default function MetricCard({ label, value, sub, accentColor }) {
  const accent = accentColor || C.vert;
  return (
    <div className="metric-card" style={{ borderLeftColor: accent }}>
      <div className="metric-label">{label}</div>
      <div className="metric-val" style={{ color: accent === C.rouge ? C.rouge : C.noir }}>
        {value}
      </div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}
