# Health Score Dashboard — Design Spec
**Date:** 2026-07-09  
**Status:** Approved

---

## Overview

A public web dashboard for a marketing agency to visualize client Health Scores. Data comes from a Google Sheets spreadsheet updated automatically via n8n whenever an account manager submits a check-in form. The dashboard is deployed publicly on Vercel so the entire team can access it via a shared link.

---

## Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Charts | Recharts |
| Deploy | Vercel (GitHub-connected) |
| Data source | Google Sheets API v4 (public, no auth) |
| No backend | All client-side |

---

## Project Structure

```
health-score-dashboard/
├── src/
│   ├── main.tsx
│   ├── App.tsx                  # Router: / and /cliente/:clienteNome
│   ├── api/
│   │   └── sheets.ts            # fetchStatusAtual(), fetchHistorico(cliente)
│   ├── pages/
│   │   ├── Dashboard.tsx        # client list + filters
│   │   └── ClienteDetalhe.tsx   # history + chart
│   ├── components/
│   │   ├── ClienteCard.tsx      # colored left-border card
│   │   ├── StatusBadge.tsx      # SAFE / CARE / DANGER badge
│   │   ├── DimensaoChip.tsx     # 🟢 BOM / 🟡 NORMAL / 🔴 RUIM chip
│   │   ├── EvolucaoChart.tsx    # Recharts line chart
│   │   └── FiltrosBar.tsx       # status + search + account filters
│   ├── types.ts                 # CheckIn, StatusFinal, StatusDimensao
│   └── index.css                # CSS tokens (colors, typography)
├── .env                         # VITE_SHEETS_ID + VITE_SHEETS_API_KEY
├── vercel.json                  # SPA rewrites (/* → /index.html)
└── vite.config.ts
```

---

## Data Layer

### Google Sheets API

Base URL:
```
https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{RANGE}?key={API_KEY}
```

Environment variables (`.env`):
```
VITE_SHEETS_ID=1tKttwrjDWqjX7T7NxNfj-k1GctyaA91o0O7nNLYNwsk
VITE_SHEETS_API_KEY=AIzaSyC0Ui1ho9INokD7gZ9cfloqXKluknVkIPU
```

### API Functions (`src/api/sheets.ts`)

```ts
fetchStatusAtual(): Promise<CheckIn[]>
// Range: "Status Atual!A2:K"
// Returns one row per client (most recent check-in)

fetchHistorico(clienteNome: string): Promise<CheckIn[]>
// Range: "Health Score!A2:K"
// Loads full history, filters client-side by cliente === clienteNome
// Returns sorted descending by data
```

In-memory cache per session. The "Atualizar" button clears the cache and re-fetches both endpoints.

### Types (`src/types.ts`)

```ts
type StatusFinal = 'SAFE' | 'CARE' | 'DANGER'
type StatusDimensao = '🟢 BOM' | '🟡 NORMAL' | '🔴 RUIM'

interface CheckIn {
  data: string
  cliente: string
  account: string
  scoreResultados: number
  statusResultados: StatusDimensao
  scoreRelacionamento: number
  statusRelacionamento: StatusDimensao
  scoreEntregas: number
  statusEntregas: StatusDimensao
  statusFinal: StatusFinal
  calculadoEm: string
}
```

Sheets columns map to CheckIn fields by position (A=data, B=cliente, C=account, D=scoreResultados, E=statusResultados, F=scoreRelacionamento, G=statusRelacionamento, H=scoreEntregas, I=statusEntregas, J=statusFinal, K=calculadoEm).

---

## Page: Dashboard (`/`)

### Layout

- **Header bar:** "Health Score Dashboard" title + last-updated timestamp + "↻ Atualizar" button
- **Counter row:** 3 colored badges — `3 DANGER · 5 CARE · 8 SAFE`
- **Filter bar:** Status pills (Todos / DANGER / CARE / SAFE) + text search by client name + account dropdown
- **Client list:** Cards sorted DANGER → CARE → SAFE

### ClienteCard

- Left border: 4px solid — red (#E53935) DANGER, amber (#F9A825) CARE, green (#43A047) SAFE
- DANGER cards show a ⚠ icon prefix on the client name
- Content: client name + StatusBadge | account + last check-in date | 3 DimensaoChips | › arrow
- Hover: slightly lighter background
- Clicking navigates to `/cliente/:clienteNome`

### Filtering

- Status filter: hides cards not matching selected status
- Text search: case-insensitive match on `cliente` field
- Account dropdown: populated from unique `account` values in data
- All filters combine (AND logic)

---

## Page: Client Detail (`/cliente/:clienteNome`)

### Layout

- **Header:** ← Dashboard link | Client name | current StatusBadge | account name
- **Evolution chart section:** Recharts LineChart — X axis = dates, Y axis = SAFE(top) / CARE / DANGER(bottom); Y is inverted so SAFE=0, CARE=1, DANGER=2 displayed top-to-bottom; line color matches most recent status; dots colored per individual status value
- **History table:** Columns: Data | Status Final | Resultados (score + status) | Relacionamento (score + status) | Entregas (score + status); sorted descending (most recent first)

### Chart mapping

```
SAFE   → y=0 → rendered at top
CARE   → y=1 → rendered in middle  
DANGER → y=2 → rendered at bottom
```

Recharts `YAxis` domain `[0, 2]` with `reversed={false}` and custom tick formatter showing status labels.

---

## Design System

### Colors

| Token | Value | Use |
|---|---|---|
| `--danger` | `#E53935` | DANGER status |
| `--care` | `#F9A825` | CARE status |
| `--safe` | `#43A047` | SAFE status |
| `--bg` | `#111111` | Page background |
| `--surface` | `#1e1e1e` | Card background |
| `--surface-2` | `#2a2a2a` | Header/elevated surfaces |
| `--border` | `#2a2a2a` | Dividers |
| `--text` | `#ffffff` | Primary text |
| `--text-muted` | `#888888` | Secondary text |

### Typography

- Font: Inter (Google Fonts)
- Body: 13px / 1.5
- Client name: 13px semibold
- Section labels: 11px uppercase, letter-spacing 0.05em, muted

### Responsive

- Desktop primary use: cards display full row (name + chips)
- Mobile: chips wrap below name, filters stack vertically

---

## Error & Loading States

- **Loading:** Spinner / skeleton placeholder — never show empty list without indication
- **API error:** Inline error message with "Tentar novamente" button — no mock data
- **Empty results (filters):** "Nenhum cliente encontrado com os filtros aplicados"
- **Client not found:** `/cliente/:nome` with no history shows "Nenhum dado encontrado para este cliente"

---

## Deploy (Vercel)

`vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Environment variables to set in Vercel dashboard:
- `VITE_SHEETS_ID`
- `VITE_SHEETS_API_KEY`

The spreadsheet must be shared as "Anyone with the link can view" for the public API key to work without OAuth.

---

## Out of Scope

- User authentication
- Own database or backend
- localStorage / sessionStorage
- Mock data
