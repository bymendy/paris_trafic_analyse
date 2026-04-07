import { useState, useMemo } from "react";
import Card from "../components/Card";
import Badge from "../components/Badge";
import { C } from "../utils/trafficHelpers";

const ETATS = ["Fluide", "Dense", "Saturé", "Bloqué"];

export default function Troncons({ troncons, loading }) {
  const [filterEtat, setFilterEtat] = useState("");
  const [search, setSearch]         = useState("");
  const [sortKey, setSortKey]       = useState("debit");
  const [sortDir, setSortDir]       = useState("desc");

  const maxDebit = useMemo(() => Math.max(...troncons.map(t => t.debit), 1), [troncons]);

  const data = useMemo(() => {
    let rows = troncons.filter(t =>
      (!filterEtat || t.etat === filterEtat) &&
      (!search || t.lib.toLowerCase().includes(search.toLowerCase()))
    );
    return [...rows].sort((a, b) => sortDir === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);
  }, [troncons, filterEtat, search, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const thBase = (key) => ({
    cursor: "pointer",
    color: sortKey === key ? C.vert : undefined,
    userSelect: "none",
  });

  return (
    <div className="fade-in">
      <div className="filter-row">
        <select onChange={e => setFilterEtat(e.target.value)}>
          <option value="">Tous les états</option>
          {ETATS.map(e => <option key={e}>{e}</option>)}
        </select>
        <input type="text" placeholder="Rechercher un tronçon..." onChange={e => setSearch(e.target.value)} />
        <span style={{ fontSize: 10, color: "#aaa", fontFamily: "var(--font-body)" }}>
          {data.length} tronçon{data.length > 1 ? "s" : ""}
        </span>
      </div>

      <Card noPad>
        <div style={{ padding: "14px 16px 0" }}>
          <div className="card-title">Liste des tronçons</div>
        </div>
        <div className="table-wrap">
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center", fontSize: 12, color: "#aaa", fontFamily: "var(--font-body)" }}>Chargement...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Arc</th>
                  <th style={{ width: "32%" }}>Libellé</th>
                  <th style={{ width: "16%", ...thBase("debit") }} onClick={() => toggleSort("debit")}>
                    Débit {sortKey === "debit" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                  </th>
                  <th style={{ width: "12%", ...thBase("taux") }} onClick={() => toggleSort("taux")}>
                    Occ. {sortKey === "taux" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                  </th>
                  <th style={{ width: "12%" }}>État</th>
                  <th>Volume</th>
                </tr>
              </thead>
              <tbody>
                {data.map((t, i) => (
                  <tr key={t.id}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(79,111,82,0.03)"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >
                    <td style={{ fontFamily: "monospace", fontSize: 10, color: "#888" }}>{t.id}</td>
                    <td style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.lib}</td>
                    <td style={{ fontWeight: 500, color: C.vert }}>{t.debit.toLocaleString()}</td>
                    <td>{t.taux}%</td>
                    <td><Badge etat={t.etat} /></td>
                    <td>
                      <div style={{ height: 5, borderRadius: 3, background: C.vert, opacity: .6, width: Math.round(t.debit / maxDebit * 90) + "px", maxWidth: "100%" }} />
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#aaa", fontSize: 12 }}>Aucun tronçon trouvé</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
