import { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  computeStats, debitParHeure, debitParEtat, topTroncons, tauxCongestion,
} from "../utils/trafficHelpers";

/**
 * Charge et parse df_trafic_clean.csv depuis /public.
 * Retourne les données brutes + agrégats prêts pour les composants.
 */
export default function useTrafficData() {
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [raw, setRaw]           = useState([]);
  const [stats, setStats]       = useState(null);
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData]   = useState([]);
  const [troncons, setTroncons] = useState([]);
  const [congestion, setCongestion] = useState(0);

  useEffect(() => {
    Papa.parse("/df_trafic_clean.csv", {
      download:       true,
      header:         true,
      delimiter:      ";",
      dynamicTyping:  false,
      skipEmptyLines: true,
      worker:         false,
      complete: ({ data, errors }) => {
        if (errors.length) {
          console.warn("Papa parse warnings:", errors.slice(0, 3));
        }
        setRaw(data);
        setStats(computeStats(data));
        setLineData(debitParHeure(data));
        setPieData(debitParEtat(data));
        setTroncons(topTroncons(data, 50));
        setCongestion(tauxCongestion(data));
        setLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setLoading(false);
      },
    });
  }, []);

  return { loading, error, raw, stats, lineData, pieData, troncons, congestion };
}
