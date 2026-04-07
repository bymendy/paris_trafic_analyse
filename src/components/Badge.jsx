import { ETAT_BADGE } from "../utils/trafficHelpers";

export default function Badge({ etat }) {
  const s = ETAT_BADGE[etat] || ETAT_BADGE["Fluide"];
  return (
    <span className="badge" style={{ background: s.bg, color: s.text }}>
      {etat}
    </span>
  );
}
