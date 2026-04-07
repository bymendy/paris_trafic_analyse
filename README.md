# ParisTrafic — Dashboard Trafic Routier

Application web React — Ville de Paris · Direction de la Voirie et des Déplacements

## Stack

- React 18 + Vite
- Recharts (graphiques)
- React-Leaflet + Leaflet (carte interactive)
- Papa Parse (lecture CSV)

## Installation locale

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Brancher le vrai dataset

1. Exécuter le notebook `Projet_MENDY_Barekine_final.ipynb` jusqu'à la cellule 11 (Export)
2. Copier `df_trafic_clean.csv` dans le dossier `public/`
3. Relancer `npm run dev`

Le hook `useTrafficData.js` parse automatiquement le CSV et alimente toutes les pages.

## Déploiement Vercel

```bash
# Option 1 — CLI Vercel
npm install -g vercel
vercel

# Option 2 — Interface Vercel
# 1. Pousser le projet sur GitHub
# 2. Importer le repo sur vercel.com
# 3. Framework détecté automatiquement : Vite
# 4. Build command  : npm run build
# 5. Output dir     : dist
# 6. Deploy
```

Le fichier `vercel.json` gère le routing SPA (rewrites vers index.html).

## Structure du projet

```
paris-trafic/
├── public/
│   └── df_trafic_clean.csv     ← dataset exporté depuis le notebook
├── src/
│   ├── components/             ← Navbar, Hero, Card, MetricCard, Badge, Heatmap
│   ├── pages/                  ← Dashboard, Upload, Insights, Troncons, Carte
│   ├── hooks/useTrafficData.js ← chargement + parsing CSV
│   ├── utils/trafficHelpers.js ← stats, couleurs, agrégats
│   ├── styles/index.css        ← charte graphique + reset
│   ├── App.jsx
│   └── main.jsx
├── vercel.json
├── vite.config.js
└── package.json
```

## Charte graphique

| Token      | Valeur    |
|------------|-----------|
| Beige      | `#E8DCCB` |
| Vert       | `#4F6F52` |
| Bleu clair | `#AFCBDA` |
| Rouge      | `#A63A2B` |
| Noir       | `#1C1C1C` |
