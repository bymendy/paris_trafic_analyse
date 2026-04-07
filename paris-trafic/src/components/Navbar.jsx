import { C } from "../utils/trafficHelpers";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "upload",    label: "Upload"    },
  { id: "insights",  label: "Insights"  },
  { id: "troncons",  label: "Tronçons"  },
  { id: "carte",     label: "Carte"     },
];

export default function Navbar({ active, onNav }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-brand-title">
          Paris<span style={{ color: C.vert }}>Trafic</span>
        </div>
        <div className="navbar-brand-sub">Ville de Paris · DVP</div>
      </div>

      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`nav-btn${active === tab.id ? " active" : ""}`}
          onClick={() => onNav(tab.id)}
        >
          {tab.label}
        </button>
      ))}

      <div style={{ marginLeft: 14, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8fcf93", animation: "pulse 2s infinite" }} />
        <span style={{ fontSize: 10, color: "#aaa", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>J-1</span>
      </div>
    </nav>
  );
}
