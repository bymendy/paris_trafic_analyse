import Card from "../components/Card";
import { C } from "../utils/trafficHelpers";

const INSIGHTS = [
  { color: C.rouge, text: "Double-pic matinal/vespéral — 08h et 18h concentrent 38% du volume journalier",  sub: "Pattern stable · tous jours ouvrables"                         },
  { color: C.rouge, text: "3 tronçons en saturation critique — taux d'occupation > 80%",                     sub: "Bd Périphérique N · Rue de Rivoli · Av. Champs-Élysées"        },
  { color: C.bleu,  text: "Vendredi soir : congestion +22% vs lundi–jeudi à la même heure",                  sub: "Axe périphérique et sorties Paris concernés"                    },
  { color: C.vert,  text: "Weekend : trafic réduit de 34% — nuit du samedi la plus fluide (02h–05h)",        sub: "Créneau idéal pour travaux et interventions planifiées"          },
  { color: C.vert,  text: "Corrélation débit/occupation r = 0.78 — cohérence capteurs validée",              sub: "Diagramme fondamental conforme à la théorie LWR"                },
  { color: C.bleu,  text: "12 tronçons avec > 5% de valeurs manquantes — capteurs à vérifier terrain",      sub: "Imputation KNN appliquée · recommandation : maintenance préventive" },
];

export default function Insights({ stats, loading }) {
  const rows = stats ? [
    { label: "Moyenne",         val: `${stats.mean.toLocaleString()} vh/h`,   note: "Niveau nominal du trafic",       danger: false },
    { label: "Médiane",         val: `${stats.median.toLocaleString()} vh/h`, note: "Distribution asymétrique droite", danger: false },
    { label: "Écart-type",      val: `${stats.std.toLocaleString()} vh/h`,    note: "Forte variabilité horaire",       danger: false },
    { label: "Maximum",         val: `${stats.max.toLocaleString()} vh/h`,    note: "Pic exceptionnel détecté",        danger: true  },
    { label: "Minimum non nul", val: `${stats.min} vh/h`,                     note: "Nuit profonde / voie secondaire", danger: false },
    { label: "Coeff. variation",val: `${stats.cv}%`,                          note: "Trafic très hétérogène",          danger: false },
  ] : [];

  return (
    <div className="fade-in">
      <div className="grid-3" style={{ marginBottom: 14 }}>
        {[["08h","Pointe matin"],["18h","Pointe soir"],["-34%","Écart weekend"]].map(([v,l],i) => (
          <div key={i} style={{ background: "rgba(175,203,218,0.18)", border: "1px solid rgba(175,203,218,0.4)", borderRadius: 8, padding: "14px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400, color: C.vert }}>{v}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "#777", marginTop: 4, letterSpacing: ".05em", textTransform: "uppercase" }}>{l}</div>
          </div>
        ))}
      </div>

      <Card title="Insights automatiques">
        {INSIGHTS.map((ins, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: i < INSIGHTS.length - 1 ? "1px solid rgba(79,111,82,0.08)" : "none" }}>
            <div style={{ width: 3, borderRadius: 2, alignSelf: "stretch", flexShrink: 0, minHeight: 34, background: ins.color }} />
            <div>
              <div className="insight-text">{ins.text}</div>
              <div className="insight-sub">{ins.sub}</div>
            </div>
          </div>
        ))}
      </Card>

      <Card title="Statistiques descriptives — Débit horaire">
        {loading ? (
          <div style={{ fontSize: 12, color: "#aaa", fontFamily: "var(--font-body)" }}>Chargement...</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "30%" }}>Indicateur</th>
                  <th style={{ width: "25%" }}>Valeur</th>
                  <th>Lecture</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.label}</td>
                    <td style={{ fontWeight: 500, color: r.danger ? C.rouge : C.vert }}>{r.val}</td>
                    <td style={{ color: "#aaa" }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
