import { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import Card from "../components/Card";
import Badge from "../components/Badge";
import { C, ETAT_COLOR } from "../utils/trafficHelpers";

function pseudoOffset(id) {
  const n = parseInt(String(id).replace(/\D/g, ""), 10) || 0;
  return [(((n * 7919) % 800) - 400) / 10000, (((n * 6271) % 800) - 400) / 10000];
}

export default function Carte({ troncons, loading }) {
  const points = useMemo(() =>
    troncons.map(t => {
      const [dlat, dlng] = pseudoOffset(t.id);
      return { ...t, lat: 48.8566 + dlat, lng: 2.3522 + dlng };
    }),
    [troncons]
  );

  const critiques = troncons.filter(t => t.etat === "Saturé" || t.etat === "Bloqué").slice(0, 6);

  return (
    <div className="fade-in">
      <Card title="Carte interactive — Réseau routier parisien">
        {loading ? (
          <div style={{ height: 360, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#aaa", fontFamily: "var(--font-body)" }}>
            Chargement de la carte...
          </div>
        ) : (
          <div style={{ borderRadius: 10, overflow: "hidden", height: 360, border: "1px solid rgba(79,111,82,0.18)" }}>
            <MapContainer center={[48.8566, 2.3522]} zoom={12} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
              {points.map((p, i) => (
                <CircleMarker key={i} center={[p.lat, p.lng]}
                  radius={6 + Math.round(p.taux / 14)}
                  pathOptions={{ fillColor: ETAT_COLOR[p.etat] || C.vert, color: "#fff", weight: 1.5, fillOpacity: 0.85 }}
                >
                  <Popup>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, minWidth: 155 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 500, color: ETAT_COLOR[p.etat], marginBottom: 5 }}>{p.lib}</div>
                      <div style={{ color: "#555", marginBottom: 2 }}>Débit : <strong>{p.debit.toLocaleString()} vh/h</strong></div>
                      <div style={{ color: "#555", marginBottom: 6 }}>Occupation : <strong>{p.taux}%</strong></div>
                      <Badge etat={p.etat} />
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        )}
        <div className="map-legend">
          {Object.entries(ETAT_COLOR).map(([label, color]) => (
            <div key={label} className="legend-item">
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
              {label}
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 10, color: "#aaa", fontFamily: "var(--font-body)" }}>
            {points.length} tronçons · Cliquer pour les détails
          </div>
        </div>
      </Card>

      {critiques.length > 0 && (
        <Card title="Zones de congestion critique">
          <div className="grid-3">
            {critiques.map((t, i) => (
              <div key={i} style={{ background: "rgba(166,58,43,0.06)", border: "1px solid rgba(166,58,43,0.15)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500, color: C.noir, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.lib}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: C.rouge }}>
                  {t.debit.toLocaleString()} vh/h · {t.taux}% occ.
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
