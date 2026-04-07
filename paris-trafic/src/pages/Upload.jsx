import { useState } from "react";
import Card from "../components/Card";
import { C } from "../utils/trafficHelpers";

const STEPS = [
  { label: "Chargement par chunks",         desc: "Blocs 100k lignes · sep=; · UTF-8"                          },
  { label: "Suppression colonnes inutiles", desc: "Arc, datetime, débit, occupation, état, geo"                },
  { label: "Doublons + imputation",         desc: "drop_duplicates + interpolate(time) + KNNImputer(k=5)"     },
  { label: "Formatage datetime",            desc: "UTC → naive + heure/jour/semaine/weekend"                   },
  { label: "Statistiques descriptives",    desc: "Moyenne · médiane · écart-type · extrêmes"                  },
  { label: "Visualisations ciblées",       desc: "Line plots · heatmap · histogramme · diagramme fondamental" },
  { label: "Encodage + export CSV",         desc: "One-hot état trafic · mapping jours · to_csv(sep=;)"        },
];

const ST = {
  idle:    { bg: C.vertLight,               color: "#2d5230", border: "transparent", label: "Prêt"  },
  running: { bg: "rgba(175,203,218,0.35)",  color: "#1a4a6b", border: C.bleu,        label: "..."   },
  done:    { bg: C.vertLight,               color: "#2d5230", border: C.vert,         label: "OK"    },
};

export default function Upload() {
  const [fileName, setFileName] = useState(null);
  const [states, setStates]     = useState(STEPS.map(() => "idle"));
  const [running, setRunning]   = useState(false);
  const [done, setDone]         = useState(false);

  function handleFile(e) {
    const f = e.target.files[0];
    if (f) { setFileName(`${f.name} · ${(f.size / 1024 / 1024).toFixed(1)} Mo`); setDone(false); }
  }

  function runPipeline() {
    if (running) return;
    setRunning(true); setDone(false);
    setStates(STEPS.map(() => "idle"));
    let i = 0;
    function next() {
      if (i >= STEPS.length) { setRunning(false); setDone(true); return; }
      setStates(prev => prev.map((s, idx) => idx === i ? "running" : s));
      setTimeout(() => {
        setStates(prev => prev.map((s, idx) => idx === i ? "done" : s));
        i++; setTimeout(next, 260);
      }, 640);
    }
    next();
  }

  return (
    <div className="fade-in">
      <Card title="Charger un dataset">
        <label className="upload-zone">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" style={{ display: "block", margin: "0 auto 12px" }}>
            <path d="M15 22V8M15 8L9 14M15 8L21 14" stroke={C.vert} strokeWidth="1.5" strokeLinecap="round" />
            <rect x="3" y="23" width="24" height="3" rx="1.5" fill={C.vertLight} />
          </svg>
          <div className="upload-title">Glisser-déposer votre fichier CSV</div>
          <div className="upload-sub">comptages-routiers-permanents.csv · séparateur ; · UTF-8</div>
          <input type="file" accept=".csv" style={{ display: "none" }} onChange={handleFile} />
        </label>
        {fileName && (
          <div style={{ marginTop: 10, padding: "8px 14px", background: C.vertLight, borderRadius: 8, fontSize: 12, color: "#2d5230", fontFamily: "var(--font-body)" }}>
            {fileName} — cliquez sur "Lancer l'analyse"
          </div>
        )}
      </Card>

      <Card title="Pipeline de traitement">
        {STEPS.map((s, i) => {
          const st = ST[states[i]];
          return (
            <div key={i} className="step" style={{ borderLeftColor: st.border }}>
              <div className="step-num">{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div className="step-label">{s.label}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
              <span className="badge" style={{ background: st.bg, color: st.color }}>{st.label}</span>
            </div>
          );
        })}
        <button className="launch-btn" onClick={runPipeline} disabled={running}>
          {running ? "Analyse en cours..." : "Lancer l'analyse"}
        </button>
        {done && (
          <div style={{ marginTop: 12, padding: "10px 14px", background: C.vertLight, borderRadius: 8, fontSize: 12, color: "#2d5230", fontFamily: "var(--font-body)" }}>
            Pipeline terminé — placez <code>df_trafic_clean.csv</code> dans <code>public/</code> pour alimenter le dashboard.
          </div>
        )}
      </Card>
    </div>
  );
}
