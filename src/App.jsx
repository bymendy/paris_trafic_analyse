import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Insights from "./pages/Insights";
import Troncons from "./pages/Troncons";
import Carte from "./pages/Carte";
import useTrafficData from "./hooks/useTrafficData";
import { C } from "./utils/trafficHelpers";

export default function App() {
  const [active, setActive] = useState("dashboard");
  const data = useTrafficData();

  const pages = {
    dashboard: <Dashboard {...data} />,
    upload:    <Upload />,
    insights:  <Insights {...data} />,
    troncons:  <Troncons {...data} />,
    carte:     <Carte    {...data} />,
  };

  return (
    <div style={{ fontFamily: "var(--font-body)", background: "var(--beige-light)", minHeight: "100vh" }}>
      <Navbar active={active} onNav={setActive} />
      <Hero activePage={active} />
      <main className="main-content">
        {data.error && (
          <div style={{ background: "rgba(166,58,43,0.08)", border: "1px solid rgba(166,58,43,0.2)", borderRadius: 10, padding: "1rem 1.2rem", fontFamily: "var(--font-body)", fontSize: 12, color: C.rouge, marginBottom: 14 }}>
            Erreur de chargement : {data.error}
            <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
              Vérifiez que <code>df_trafic_clean.csv</code> est présent dans le dossier <code>public/</code>.
            </div>
          </div>
        )}
        {pages[active]}
      </main>
    </div>
  );
}
