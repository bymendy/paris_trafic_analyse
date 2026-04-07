import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import MetricCard from "../components/MetricCard";
import Card from "../components/Card";
import Heatmap from "../components/Heatmap";
import { C } from "../utils/trafficHelpers";

export default function Dashboard({ stats, lineData, pieData, raw, congestion, loading }) {
  if (loading) return <Loader />;
  return (
    <div className="fade-in">
      <div className="grid-4" style={{ marginBottom: 14 }}>
        <MetricCard label="Débit moyen"       value={stats ? `${stats.mean.toLocaleString()} vh/h` : "—"} sub="tous tronçons actifs" />
        <MetricCard label="Taux d'occupation" value={stats ? `${stats.tauxMean}%` : "—"}                  sub="capteurs en ligne"     accentColor={C.bleu}  />
        <MetricCard label="Mesures totales"   value={stats ? raw.length.toLocaleString() : "—"}            sub="lignes dans le dataset" accentColor="#c8a96e" />
        <MetricCard label="Congestion"        value={`${congestion}%`}                                     sub="tronçons saturés"      accentColor={C.rouge} />
      </div>

      <div className="grid-2">
        <Card title="Débit horaire moyen — 24h">
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(79,111,82,0.07)" />
              <XAxis dataKey="heure" tick={{ fontSize: 9, fontFamily: "var(--font-body)" }} interval={3} />
              <YAxis tick={{ fontSize: 9, fontFamily: "var(--font-body)" }} />
              <Tooltip contentStyle={{ fontFamily: "var(--font-body)", fontSize: 11, borderColor: "rgba(79,111,82,0.2)" }} />
              <Line type="monotone" dataKey="debit" name="Débit (vh/h)" stroke={C.vert} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Répartition état du trafic">
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={2}>
                {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Legend iconSize={10} wrapperStyle={{ fontFamily: "var(--font-body)", fontSize: 11 }} />
              <Tooltip contentStyle={{ fontFamily: "var(--font-body)", fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Heatmap congestion — Heure × Jour">
        <Heatmap rows={raw} />
      </Card>
    </div>
  );
}

function Loader() {
  return (
    <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontFamily: "var(--font-body)", fontSize: 13 }}>
      Chargement des données...
    </div>
  );
}
