export const C = {
  beige:      "#E8DCCB",
  beigeLight: "#F4EDE0",
  vert:       "#4F6F52",
  vertLight:  "#D6E4D7",
  bleu:       "#AFCBDA",
  rouge:      "#A63A2B",
  noir:       "#1C1C1C",
};

export const ETAT_COLOR = {
  Fluide:  C.vert,
  Dense:   C.bleu,
  Saturé:  C.rouge,
  Bloqué:  C.noir,
};

export const ETAT_BADGE = {
  Fluide: { bg: C.vertLight,              text: "#2d5230" },
  Dense:  { bg: "rgba(175,203,218,0.35)", text: "#1a4a6b" },
  Saturé: { bg: "rgba(166,58,43,0.15)",  text: C.rouge   },
  Bloqué: { bg: "rgba(28,28,28,0.1)",    text: C.noir    },
};

export const PAGE_META = {
  dashboard: {
    title: "Analyse du Trafic Routier Parisien",
    sub:   "Direction de la Voirie et des Déplacements · 13 mois glissants · 1 284 capteurs",
  },
  upload: {
    title: "Upload & Analyse des données",
    sub:   "Chargez votre dataset CSV et lancez le pipeline de traitement automatisé",
  },
  insights: {
    title: "Insights & Statistiques",
    sub:   "Patterns identifiés sur 13 mois · données capteurs permanents parisiens",
  },
  troncons: {
    title: "Tronçons — Vue détaillée",
    sub:   "Filtrez et explorez les tronçons du réseau routier parisien",
  },
  carte: {
    title: "Carte interactive de Paris",
    sub:   "Visualisation géographique de la congestion par tronçon",
  },
};

export const IMG_HERO =
  "https://res.cloudinary.com/dwdkltr38/image/upload/v1775575124/analyse_donnees_paris_npqqdy.jpg";

/** Calcule les stats descriptives depuis les données CSV */
export function computeStats(rows) {
  if (!rows.length) return null;
  const debits = rows.map(r => Number(r["Débit horaire"])).filter(v => !isNaN(v) && v > 0);
  const taux   = rows.map(r => Number(r["Taux d'occupation"])).filter(v => !isNaN(v));
  const sorted = [...debits].sort((a, b) => a - b);
  const mean   = debits.reduce((s, v) => s + v, 0) / debits.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const std    = Math.sqrt(debits.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / debits.length);
  return {
    count:   rows.length,
    mean:    Math.round(mean),
    median:  Math.round(median),
    std:     Math.round(std),
    max:     Math.round(Math.max(...debits)),
    min:     Math.round(Math.min(...debits.filter(v => v > 0))),
    cv:      Math.round((std / mean) * 100),
    tauxMean: (taux.reduce((s, v) => s + v, 0) / taux.length).toFixed(1),
  };
}

/** Agrège débit moyen par heure (0-23) */
export function debitParHeure(rows) {
  const acc = Array.from({ length: 24 }, () => ({ sum: 0, count: 0 }));
  rows.forEach(r => {
    const h = Number(r.heure);
    const d = Number(r["Débit horaire"]);
    if (!isNaN(h) && !isNaN(d)) { acc[h].sum += d; acc[h].count++; }
  });
  return acc.map((a, h) => ({ heure: `${h}h`, debit: a.count ? Math.round(a.sum / a.count) : 0 }));
}

/** Agrège débit moyen par état trafic pour le donut */
export function debitParEtat(rows) {
  const acc = {};
  rows.forEach(r => {
    const e = r["État trafic"] || "Inconnu";
    if (!acc[e]) acc[e] = { sum: 0, count: 0 };
    acc[e].sum += Number(r["Débit horaire"]) || 0;
    acc[e].count++;
  });
  return Object.entries(acc).map(([name, { count }]) => ({
    name, value: count, color: ETAT_COLOR[name] || "#888",
  }));
}

/** Top N tronçons par débit moyen */
export function topTroncons(rows, n = 10) {
  const acc = {};
  rows.forEach(r => {
    const id  = r["Identifiant arc"];
    const lib = r["Libelle"] || id;
    const d   = Number(r["Débit horaire"]) || 0;
    const t   = Number(r["Taux d'occupation"]) || 0;
    const e   = r["État trafic"] || "Fluide";
    if (!acc[id]) acc[id] = { id, lib, debitSum: 0, tauxSum: 0, count: 0, etat: e };
    acc[id].debitSum += d;
    acc[id].tauxSum  += t;
    acc[id].count++;
    acc[id].etat = e;
  });
  return Object.values(acc)
    .map(t => ({ ...t, debit: Math.round(t.debitSum / t.count), taux: Math.round(t.tauxSum / t.count) }))
    .sort((a, b) => b.debit - a.debit)
    .slice(0, n);
}

/** Pourcentage congestion (Saturé + Bloqué) */
export function tauxCongestion(rows) {
  if (!rows.length) return 0;
  const cong = rows.filter(r => ["Saturé","Bloqué"].includes(r["État trafic"])).length;
  return Math.round((cong / rows.length) * 100);
}
