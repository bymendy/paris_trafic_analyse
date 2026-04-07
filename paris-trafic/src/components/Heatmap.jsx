import { useRef, useEffect } from "react";

const DAYS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

export default function Heatmap({ rows = [] }) {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const cw  = Math.floor((cv.width - 32) / 24);
    const ch  = Math.floor((cv.height - 16) / 7);

    // Agrégation heure × jour depuis données réelles si dispo
    const matrix = Array.from({ length: 7 }, () => Array(24).fill({ sum: 0, count: 0 }));
    const dayMap  = { Lundi:0, Mardi:1, Mercredi:2, Jeudi:3, Vendredi:4, Samedi:5, Dimanche:6 };

    if (rows.length) {
      rows.forEach(r => {
        const h = Number(r.heure);
        const d = dayMap[r.jour_semaine_fr];
        const v = Number(r["Débit horaire"]);
        if (!isNaN(h) && d !== undefined && !isNaN(v)) {
          const cur = matrix[d][h];
          matrix[d][h] = { sum: cur.sum + v, count: cur.count + 1 };
        }
      });
    }

    // Calcul max pour normalisation
    let globalMax = 1;
    matrix.forEach(row => row.forEach(cell => {
      const v = cell.count ? cell.sum / cell.count : 0;
      if (v > globalMax) globalMax = v;
    }));

    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.font = "9px Georgia,serif";

    for (let d = 0; d < 7; d++) {
      ctx.fillStyle = "#777";
      ctx.fillText(DAYS[d], 0, 16 + d * ch + ch / 2 + 3);
    }

    for (let h = 0; h < 24; h++) {
      if (h % 4 === 0) {
        ctx.fillStyle = "#777";
        ctx.fillText(h + "h", 34 + h * cw, 9);
      }
      for (let d = 0; d < 7; d++) {
        let val;
        if (rows.length && matrix[d][h].count) {
          val = (matrix[d][h].sum / matrix[d][h].count) / globalMax;
        } else {
          // fallback simulé
          val = Math.min(1, (100 + 400 * Math.exp(-Math.pow(h - 8, 2) / 4) + 340 * Math.exp(-Math.pow(h - 18, 2) / 5)) / (d < 5 ? 1 : 1.65) / 1350);
        }
        if      (val < 0.28) ctx.fillStyle = `rgba(79,111,82,${0.25 + val * 2})`;
        else if (val < 0.58) ctx.fillStyle = `rgba(175,203,218,${0.4 + val * 0.8})`;
        else                 ctx.fillStyle = `rgba(166,58,43,${0.35 + val * 0.6})`;
        ctx.fillRect(34 + h * cw, 14 + d * ch, cw - 1, ch - 1);
      }
    }
  }, [rows]);

  return (
    <canvas
      ref={ref}
      width={580}
      height={128}
      style={{ width: "100%", height: "auto" }}
    />
  );
}
