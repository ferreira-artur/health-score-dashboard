# Health Score Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public React + Vite dashboard that reads Health Score data from Google Sheets and displays client status, filters, and evolution history.

**Architecture:** Purely client-side SPA with React Router v6 for two routes (`/` and `/cliente/:clienteNome`). Data is fetched from Google Sheets API v4 using a public API key, parsed into typed `CheckIn` objects, cached in memory per session, and filtered/sorted client-side. No backend, no auth, no localStorage.

**Tech Stack:** React 18, Vite, TypeScript, React Router v6, Recharts, Vitest, @testing-library/react

---

## File Map

| File | Responsibility |
|---|---|
| `src/types.ts` | `CheckIn`, `StatusFinal`, `StatusDimensao` types |
| `src/api/sheets.ts` | Sheets API fetch + row parsing + in-memory cache |
| `src/index.css` | CSS custom properties (color tokens, typography) |
| `src/components/StatusBadge.tsx` | SAFE / CARE / DANGER colored pill |
| `src/components/DimensaoChip.tsx` | 🟢/🟡/🔴 dimension status chip |
| `src/components/ClienteCard.tsx` | Client row card with left color border |
| `src/components/FiltrosBar.tsx` | Status pills + text search + account dropdown |
| `src/components/EvolucaoChart.tsx` | Recharts line chart for status evolution |
| `src/pages/Dashboard.tsx` | Main page: fetch + filter + sort + render cards |
| `src/pages/ClienteDetalhe.tsx` | Client detail page: chart + history table |
| `src/App.tsx` | React Router setup |
| `src/main.tsx` | App entry point |
| `vercel.json` | SPA rewrite rule |
| `.env` | Sheets credentials (not committed) |
| `.env.example` | Template with placeholder values |

---

## Task 1: Scaffold project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `.env`, `.env.example`, `vercel.json`, `.gitignore`

- [ ] **Step 1: Create Vite project**

Run in `C:\Users\nunes\Projects\`:
```bash
npm create vite@latest health-score-dashboard -- --template react-ts
cd health-score-dashboard
```

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install react-router-dom recharts
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/ui
```

- [ ] **Step 4: Configure Vitest in `vite.config.ts`**

Replace the generated `vite.config.ts` with:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

- [ ] **Step 5: Create `src/test-setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Create `.env`**

```
VITE_SHEETS_ID=1tKttwrjDWqjX7T7NxNfj-k1GctyaA91o0O7nNLYNwsk
VITE_SHEETS_API_KEY=AIzaSyC0Ui1ho9INokD7gZ9cfloqXKluknVkIPU
```

- [ ] **Step 7: Create `.env.example`**

```
VITE_SHEETS_ID=your_google_sheets_id_here
VITE_SHEETS_API_KEY=your_google_sheets_api_key_here
```

- [ ] **Step 8: Create `vercel.json`**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 9: Update `.gitignore`**

Make sure `.gitignore` includes:
```
.env
.superpowers/
```

- [ ] **Step 10: Add test script to `package.json`**

In the `scripts` section, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 11: Verify the scaffold runs**

```bash
npm run dev
```
Expected: Vite dev server starts, browser shows React starter page at `http://localhost:5173`.

- [ ] **Step 12: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Vite + React + TS project"
```

---

## Task 2: Types and global CSS tokens

**Files:**
- Create: `src/types.ts`, `src/index.css`
- Modify: `src/main.tsx` (import CSS)

- [ ] **Step 1: Create `src/types.ts`**

```ts
export type StatusFinal = 'SAFE' | 'CARE' | 'DANGER'
export type StatusDimensao = '🟢 BOM' | '🟡 NORMAL' | '🔴 RUIM'

export interface CheckIn {
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

- [ ] **Step 2: Replace `src/index.css` with design tokens**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --danger: #E53935;
  --care: #F9A825;
  --safe: #43A047;

  --danger-bg: #2a1a1a;
  --care-bg: #2a2210;
  --safe-bg: #0f2a18;

  --bg: #111111;
  --surface: #1e1e1e;
  --surface-2: #1a1a1a;
  --surface-3: #2a2a2a;
  --border: #2a2a2a;

  --text: #ffffff;
  --text-muted: #888888;
  --text-dim: #555555;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg);
  color: var(--text);
  font-size: 13px;
  line-height: 1.5;
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
  font-family: inherit;
}

input, select {
  font-family: inherit;
}
```

- [ ] **Step 3: Update `src/main.tsx` to import CSS**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/index.css src/main.tsx src/test-setup.ts vite.config.ts
git commit -m "feat: add types and design tokens"
```

---

## Task 3: Sheets API layer

**Files:**
- Create: `src/api/sheets.ts`, `src/api/sheets.test.ts`

- [ ] **Step 1: Write failing tests for row parsing**

Create `src/api/sheets.test.ts`:
```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { parseRow, fetchStatusAtual, fetchHistorico, clearCache } from './sheets'
import type { CheckIn } from '../types'

const VALID_ROW = [
  '05/07/2026', 'Empresa ABC', 'Ana Lima',
  '4.2', '🔴 RUIM',
  '6.1', '🟡 NORMAL',
  '8.5', '🟢 BOM',
  'DANGER', '05/07/2026 14:30'
]

describe('parseRow', () => {
  it('maps a Sheets row array to a CheckIn object', () => {
    const result = parseRow(VALID_ROW)
    expect(result).toEqual<CheckIn>({
      data: '05/07/2026',
      cliente: 'Empresa ABC',
      account: 'Ana Lima',
      scoreResultados: 4.2,
      statusResultados: '🔴 RUIM',
      scoreRelacionamento: 6.1,
      statusRelacionamento: '🟡 NORMAL',
      scoreEntregas: 8.5,
      statusEntregas: '🟢 BOM',
      statusFinal: 'DANGER',
      calculadoEm: '05/07/2026 14:30',
    })
  })

  it('parses numeric scores as floats', () => {
    const result = parseRow(VALID_ROW)
    expect(typeof result.scoreResultados).toBe('number')
    expect(result.scoreResultados).toBe(4.2)
  })
})

describe('fetchHistorico', () => {
  beforeEach(() => {
    clearCache()
    vi.restoreAllMocks()
  })

  it('filters by clienteNome and sorts descending by data', async () => {
    const mockRows = [
      ['01/01/2026', 'Empresa ABC', 'Ana Lima', '7', '🟢 BOM', '7', '🟢 BOM', '7', '🟢 BOM', 'SAFE', ''],
      ['15/06/2026', 'Empresa ABC', 'Ana Lima', '4', '🔴 RUIM', '6', '🟡 NORMAL', '8', '🟢 BOM', 'DANGER', ''],
      ['01/03/2026', 'Outro Cliente', 'Bruno', '8', '🟢 BOM', '8', '🟢 BOM', '8', '🟢 BOM', 'SAFE', ''],
    ]

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ values: mockRows }),
    } as Response)

    const result = await fetchHistorico('Empresa ABC')

    expect(result).toHaveLength(2)
    expect(result[0].data).toBe('15/06/2026')
    expect(result[1].data).toBe('01/01/2026')
    expect(result.every(r => r.cliente === 'Empresa ABC')).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```
Expected: FAIL — `parseRow`, `fetchStatusAtual`, `fetchHistorico`, `clearCache` not found.

- [ ] **Step 3: Implement `src/api/sheets.ts`**

```ts
import type { CheckIn, StatusDimensao, StatusFinal } from '../types'

const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets'
const SHEET_ID = import.meta.env.VITE_SHEETS_ID
const API_KEY = import.meta.env.VITE_SHEETS_API_KEY

export function parseRow(row: string[]): CheckIn {
  return {
    data: row[0] ?? '',
    cliente: row[1] ?? '',
    account: row[2] ?? '',
    scoreResultados: parseFloat(row[3]) || 0,
    statusResultados: row[4] as StatusDimensao,
    scoreRelacionamento: parseFloat(row[5]) || 0,
    statusRelacionamento: row[6] as StatusDimensao,
    scoreEntregas: parseFloat(row[7]) || 0,
    statusEntregas: row[8] as StatusDimensao,
    statusFinal: row[9] as StatusFinal,
    calculadoEm: row[10] ?? '',
  }
}

async function fetchRange(range: string): Promise<string[][]> {
  const url = `${SHEETS_BASE}/${SHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sheets API error: ${res.status}`)
  const data = await res.json()
  return data.values ?? []
}

let statusAtualCache: CheckIn[] | null = null
let historicoCache: string[][] | null = null

export function clearCache() {
  statusAtualCache = null
  historicoCache = null
}

export async function fetchStatusAtual(): Promise<CheckIn[]> {
  if (statusAtualCache) return statusAtualCache
  const rows = await fetchRange('Status Atual!A2:K')
  statusAtualCache = rows.filter(r => r.length >= 10).map(parseRow)
  return statusAtualCache
}

export async function fetchHistorico(clienteNome: string): Promise<CheckIn[]> {
  if (!historicoCache) {
    historicoCache = await fetchRange('Health Score!A2:K')
  }
  return historicoCache
    .filter(r => r.length >= 10 && r[1] === clienteNome)
    .map(parseRow)
    .sort((a, b) => {
      const toDate = (d: string) => {
        const [day, month, year] = d.split('/')
        return new Date(`${year}-${month}-${day}`).getTime()
      }
      return toDate(b.data) - toDate(a.data)
    })
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/api/sheets.ts src/api/sheets.test.ts
git commit -m "feat: Sheets API layer with parsing and caching"
```

---

## Task 4: StatusBadge and DimensaoChip components

**Files:**
- Create: `src/components/StatusBadge.tsx`, `src/components/StatusBadge.test.tsx`
- Create: `src/components/DimensaoChip.tsx`, `src/components/DimensaoChip.test.tsx`

- [ ] **Step 1: Write failing tests for StatusBadge**

Create `src/components/StatusBadge.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('renders DANGER with red background', () => {
    render(<StatusBadge status="DANGER" />)
    const badge = screen.getByText(/DANGER/)
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveStyle({ backgroundColor: '#E53935' })
  })

  it('renders CARE with amber background', () => {
    render(<StatusBadge status="CARE" />)
    const badge = screen.getByText(/CARE/)
    expect(badge).toHaveStyle({ backgroundColor: '#F9A825' })
  })

  it('renders SAFE with green background', () => {
    render(<StatusBadge status="SAFE" />)
    const badge = screen.getByText(/SAFE/)
    expect(badge).toHaveStyle({ backgroundColor: '#43A047' })
  })
})
```

- [ ] **Step 2: Write failing tests for DimensaoChip**

Create `src/components/DimensaoChip.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DimensaoChip } from './DimensaoChip'

describe('DimensaoChip', () => {
  it('renders the status text', () => {
    render(<DimensaoChip label="Resultados" status="🔴 RUIM" />)
    expect(screen.getByText(/Resultados/)).toBeInTheDocument()
    expect(screen.getByText(/🔴 RUIM/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npm test
```
Expected: FAIL — components not found.

- [ ] **Step 4: Implement `src/components/StatusBadge.tsx`**

```tsx
import type { StatusFinal } from '../types'

const CONFIG: Record<StatusFinal, { bg: string; color: string; label: string }> = {
  DANGER: { bg: '#E53935', color: '#fff', label: '⚠ DANGER' },
  CARE:   { bg: '#F9A825', color: '#111', label: 'CARE' },
  SAFE:   { bg: '#43A047', color: '#fff', label: 'SAFE' },
}

interface Props {
  status: StatusFinal
}

export function StatusBadge({ status }: Props) {
  const { bg, color, label } = CONFIG[status]
  return (
    <span style={{
      backgroundColor: bg,
      color,
      fontSize: '10px',
      fontWeight: 700,
      padding: '2px 7px',
      borderRadius: '3px',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}
```

- [ ] **Step 5: Implement `src/components/DimensaoChip.tsx`**

```tsx
import type { StatusDimensao } from '../types'

const COLOR: Record<StatusDimensao, { color: string; bg: string }> = {
  '🟢 BOM':    { color: 'var(--safe)',  bg: 'var(--safe-bg)' },
  '🟡 NORMAL': { color: 'var(--care)',  bg: 'var(--care-bg)' },
  '🔴 RUIM':   { color: 'var(--danger)', bg: 'var(--danger-bg)' },
}

interface Props {
  label: string
  status: StatusDimensao
}

export function DimensaoChip({ label, status }: Props) {
  const { color, bg } = COLOR[status]
  return (
    <span style={{
      backgroundColor: bg,
      color,
      fontSize: '10px',
      fontWeight: 600,
      padding: '3px 8px',
      borderRadius: '4px',
      whiteSpace: 'nowrap',
    }}>
      {status} {label}
    </span>
  )
}
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npm test
```
Expected: All tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/
git commit -m "feat: StatusBadge and DimensaoChip components"
```

---

## Task 5: ClienteCard component

**Files:**
- Create: `src/components/ClienteCard.tsx`, `src/components/ClienteCard.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/ClienteCard.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ClienteCard } from './ClienteCard'
import type { CheckIn } from '../types'

const DANGER_CHECKIN: CheckIn = {
  data: '05/07/2026',
  cliente: 'Empresa ABC',
  account: 'Ana Lima',
  scoreResultados: 4.2,
  statusResultados: '🔴 RUIM',
  scoreRelacionamento: 6.1,
  statusRelacionamento: '🟡 NORMAL',
  scoreEntregas: 8.5,
  statusEntregas: '🟢 BOM',
  statusFinal: 'DANGER',
  calculadoEm: '',
}

describe('ClienteCard', () => {
  it('renders client name and account', () => {
    render(<ClienteCard checkIn={DANGER_CHECKIN} onClick={() => {}} />)
    expect(screen.getByText(/Empresa ABC/)).toBeInTheDocument()
    expect(screen.getByText(/Ana Lima/)).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<ClienteCard checkIn={DANGER_CHECKIN} onClick={handleClick} />)
    fireEvent.click(screen.getByRole('article'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```
Expected: FAIL — `ClienteCard` not found.

- [ ] **Step 3: Implement `src/components/ClienteCard.tsx`**

```tsx
import type { CheckIn, StatusFinal } from '../types'
import { StatusBadge } from './StatusBadge'
import { DimensaoChip } from './DimensaoChip'

const BORDER_COLOR: Record<StatusFinal, string> = {
  DANGER: 'var(--danger)',
  CARE:   'var(--care)',
  SAFE:   'var(--safe)',
}

interface Props {
  checkIn: CheckIn
  onClick: () => void
}

export function ClienteCard({ checkIn, onClick }: Props) {
  const borderColor = BORDER_COLOR[checkIn.statusFinal]

  return (
    <article
      role="article"
      onClick={onClick}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '7px',
        borderLeft: `4px solid ${borderColor}`,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        gap: '12px',
      }}
      onMouseOver={e => (e.currentTarget.style.backgroundColor = '#252525')}
      onMouseOut={e => (e.currentTarget.style.backgroundColor = 'var(--surface)')}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '13px' }}>
            {checkIn.cliente}
          </span>
          <StatusBadge status={checkIn.statusFinal} />
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
          Account: {checkIn.account} · Check-in: {checkIn.data}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <DimensaoChip label="Resultados"     status={checkIn.statusResultados} />
        <DimensaoChip label="Relacionamento" status={checkIn.statusRelacionamento} />
        <DimensaoChip label="Entregas"       status={checkIn.statusEntregas} />
        <span style={{ color: 'var(--text-dim)', fontSize: '14px', marginLeft: '4px' }}>›</span>
      </div>
    </article>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ClienteCard.tsx src/components/ClienteCard.test.tsx
git commit -m "feat: ClienteCard component"
```

---

## Task 6: FiltrosBar component

**Files:**
- Create: `src/components/FiltrosBar.tsx`, `src/components/FiltrosBar.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/FiltrosBar.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FiltrosBar } from './FiltrosBar'

describe('FiltrosBar', () => {
  const defaultProps = {
    statusFilter: 'Todos' as const,
    onStatusFilter: vi.fn(),
    searchText: '',
    onSearchText: vi.fn(),
    accountFilter: 'Todos',
    onAccountFilter: vi.fn(),
    accounts: ['Ana Lima', 'Bruno Costa'],
  }

  it('renders all status filter buttons', () => {
    render(<FiltrosBar {...defaultProps} />)
    expect(screen.getByText('Todos')).toBeInTheDocument()
    expect(screen.getByText('DANGER')).toBeInTheDocument()
    expect(screen.getByText('CARE')).toBeInTheDocument()
    expect(screen.getByText('SAFE')).toBeInTheDocument()
  })

  it('calls onSearchText when typing in search field', () => {
    const onSearchText = vi.fn()
    render(<FiltrosBar {...defaultProps} onSearchText={onSearchText} />)
    fireEvent.change(screen.getByPlaceholderText(/Buscar cliente/i), {
      target: { value: 'ABC' },
    })
    expect(onSearchText).toHaveBeenCalledWith('ABC')
  })

  it('renders account options in dropdown', () => {
    render(<FiltrosBar {...defaultProps} />)
    expect(screen.getByText('Ana Lima')).toBeInTheDocument()
    expect(screen.getByText('Bruno Costa')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```
Expected: FAIL — `FiltrosBar` not found.

- [ ] **Step 3: Implement `src/components/FiltrosBar.tsx`**

```tsx
import type { StatusFinal } from '../types'

type StatusFilter = 'Todos' | StatusFinal

const STATUS_OPTIONS: StatusFilter[] = ['Todos', 'DANGER', 'CARE', 'SAFE']

const PILL_COLOR: Record<StatusFilter, string> = {
  Todos:  '#888',
  DANGER: '#E53935',
  CARE:   '#F9A825',
  SAFE:   '#43A047',
}

interface Props {
  statusFilter: StatusFilter
  onStatusFilter: (v: StatusFilter) => void
  searchText: string
  onSearchText: (v: string) => void
  accountFilter: string
  onAccountFilter: (v: string) => void
  accounts: string[]
}

export function FiltrosBar({
  statusFilter, onStatusFilter,
  searchText, onSearchText,
  accountFilter, onAccountFilter,
  accounts,
}: Props) {
  return (
    <div style={{
      padding: '12px 20px',
      display: 'flex',
      gap: '10px',
      borderBottom: '1px solid var(--border)',
      flexWrap: 'wrap',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', gap: '6px' }}>
        {STATUS_OPTIONS.map(opt => {
          const active = statusFilter === opt
          const color = PILL_COLOR[opt]
          return (
            <button
              key={opt}
              onClick={() => onStatusFilter(opt)}
              style={{
                backgroundColor: active ? color : 'var(--surface-3)',
                color: active ? (opt === 'CARE' ? '#111' : '#fff') : 'var(--text-muted)',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: active ? 700 : 400,
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>

      <input
        type="text"
        placeholder="🔍 Buscar cliente..."
        value={searchText}
        onChange={e => onSearchText(e.target.value)}
        style={{
          backgroundColor: 'var(--surface-3)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: '4px 10px',
          color: 'var(--text)',
          fontSize: '11px',
          flex: 1,
          minWidth: '120px',
        }}
      />

      <select
        value={accountFilter}
        onChange={e => onAccountFilter(e.target.value)}
        style={{
          backgroundColor: 'var(--surface-3)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: '4px 10px',
          color: 'var(--text-muted)',
          fontSize: '11px',
        }}
      >
        <option value="Todos">Todos os accounts</option>
        {accounts.map(a => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/FiltrosBar.tsx src/components/FiltrosBar.test.tsx
git commit -m "feat: FiltrosBar component"
```

---

## Task 7: Dashboard page

**Files:**
- Create: `src/pages/Dashboard.tsx`

- [ ] **Step 1: Implement `src/pages/Dashboard.tsx`**

```tsx
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchStatusAtual, clearCache } from '../api/sheets'
import type { CheckIn, StatusFinal } from '../types'
import { ClienteCard } from '../components/ClienteCard'
import { FiltrosBar } from '../components/FiltrosBar'

type StatusFilter = 'Todos' | StatusFinal

const STATUS_ORDER: Record<StatusFinal, number> = { DANGER: 0, CARE: 1, SAFE: 2 }

export function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos')
  const [searchText, setSearchText] = useState('')
  const [accountFilter, setAccountFilter] = useState('Todos')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchStatusAtual()
      setData(result)
      setLastUpdated(new Date())
    } catch (e) {
      setError('Erro ao carregar dados. Verifique a conexão e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleRefresh = () => {
    clearCache()
    load()
  }

  const accounts = useMemo(() => {
    return [...new Set(data.map(d => d.account))].sort()
  }, [data])

  const filtered = useMemo(() => {
    return data
      .filter(c => statusFilter === 'Todos' || c.statusFinal === statusFilter)
      .filter(c => c.cliente.toLowerCase().includes(searchText.toLowerCase()))
      .filter(c => accountFilter === 'Todos' || c.account === accountFilter)
      .sort((a, b) => STATUS_ORDER[a.statusFinal] - STATUS_ORDER[b.statusFinal])
  }, [data, statusFilter, searchText, accountFilter])

  const counts = useMemo(() => ({
    DANGER: data.filter(c => c.statusFinal === 'DANGER').length,
    CARE:   data.filter(c => c.statusFinal === 'CARE').length,
    SAFE:   data.filter(c => c.statusFinal === 'SAFE').length,
  }), [data])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'var(--surface-2)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '15px' }}>Health Score</span>
          <span style={{ color: 'var(--text-dim)', fontSize: '13px', marginLeft: '8px' }}>Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {lastUpdated && (
            <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
              Atualizado {lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              backgroundColor: 'var(--surface-3)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              borderRadius: '5px',
              padding: '5px 10px',
              fontSize: '11px',
            }}
          >
            ↻ Atualizar
          </button>
        </div>
      </header>

      {/* Counters */}
      {!loading && !error && (
        <div style={{ padding: '14px 20px', display: 'flex', gap: '12px', borderBottom: '1px solid #1e1e1e', flexWrap: 'wrap' }}>
          {(['DANGER', 'CARE', 'SAFE'] as StatusFinal[]).map(s => (
            <div key={s} style={{
              backgroundColor: s === 'DANGER' ? 'var(--danger-bg)' : s === 'CARE' ? 'var(--care-bg)' : 'var(--safe-bg)',
              border: `1px solid var(--${s.toLowerCase()})`,
              borderRadius: '6px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ color: `var(--${s.toLowerCase()})`, fontWeight: 700, fontSize: '18px' }}>{counts[s]}</span>
              <span style={{ color: `var(--${s.toLowerCase()})`, fontSize: '11px', fontWeight: 600 }}>{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <FiltrosBar
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
        searchText={searchText}
        onSearchText={setSearchText}
        accountFilter={accountFilter}
        onAccountFilter={setAccountFilter}
        accounts={accounts}
      />

      {/* Content */}
      <main style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {loading && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
            Carregando dados...
          </p>
        )}

        {error && (
          <div style={{ color: 'var(--danger)', textAlign: 'center', padding: '40px' }}>
            <p>{error}</p>
            <button
              onClick={handleRefresh}
              style={{ marginTop: '12px', backgroundColor: 'var(--surface-3)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '5px', padding: '6px 14px', fontSize: '12px' }}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
            Nenhum cliente encontrado com os filtros aplicados.
          </p>
        )}

        {filtered.map(c => (
          <ClienteCard
            key={c.cliente}
            checkIn={c}
            onClick={() => navigate(`/cliente/${encodeURIComponent(c.cliente)}`)}
          />
        ))}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Dashboard.tsx
git commit -m "feat: Dashboard page with filters and client list"
```

---

## Task 8: EvolucaoChart component

**Files:**
- Create: `src/components/EvolucaoChart.tsx`, `src/components/EvolucaoChart.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/EvolucaoChart.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { statusToY, yToLabel } from './EvolucaoChart'

describe('statusToY', () => {
  it('maps SAFE to 0 (top of chart)', () => {
    expect(statusToY('SAFE')).toBe(0)
  })
  it('maps CARE to 1', () => {
    expect(statusToY('CARE')).toBe(1)
  })
  it('maps DANGER to 2 (bottom of chart)', () => {
    expect(statusToY('DANGER')).toBe(2)
  })
})

describe('yToLabel', () => {
  it('returns SAFE for 0', () => {
    expect(yToLabel(0)).toBe('SAFE')
  })
  it('returns CARE for 1', () => {
    expect(yToLabel(1)).toBe('CARE')
  })
  it('returns DANGER for 2', () => {
    expect(yToLabel(2)).toBe('DANGER')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```
Expected: FAIL — `statusToY` and `yToLabel` not exported.

- [ ] **Step 3: Implement `src/components/EvolucaoChart.tsx`**

```tsx
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import type { CheckIn, StatusFinal } from '../types'

export function statusToY(status: StatusFinal): number {
  return { SAFE: 0, CARE: 1, DANGER: 2 }[status]
}

export function yToLabel(y: number): string {
  return ['SAFE', 'CARE', 'DANGER'][y] ?? ''
}

const STATUS_COLOR: Record<StatusFinal, string> = {
  SAFE:   '#43A047',
  CARE:   '#F9A825',
  DANGER: '#E53935',
}

interface Props {
  history: CheckIn[]
}

export function EvolucaoChart({ history }: Props) {
  const chartData = [...history]
    .reverse()
    .map(c => ({
      data: c.data,
      y: statusToY(c.statusFinal),
      status: c.statusFinal,
    }))

  const latestStatus = history[0]?.statusFinal ?? 'SAFE'
  const lineColor = STATUS_COLOR[latestStatus]

  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid stroke="#1e1e1e" vertical={false} />
        <XAxis
          dataKey="data"
          tick={{ fill: '#555', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 2]}
          reversed
          ticks={[0, 1, 2]}
          tickFormatter={yToLabel}
          tick={{ fill: '#555', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          formatter={(value: number) => [yToLabel(value), 'Status']}
          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', fontSize: '11px' }}
          labelStyle={{ color: '#888' }}
          itemStyle={{ color: lineColor }}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke={lineColor}
          strokeWidth={2.5}
          dot={({ cx, cy, payload }) => (
            <circle
              key={`dot-${payload.data}`}
              cx={cx}
              cy={cy}
              r={4}
              fill={STATUS_COLOR[payload.status as StatusFinal]}
              stroke="none"
            />
          )}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/EvolucaoChart.tsx src/components/EvolucaoChart.test.tsx
git commit -m "feat: EvolucaoChart component with Recharts"
```

---

## Task 9: ClienteDetalhe page

**Files:**
- Create: `src/pages/ClienteDetalhe.tsx`

- [ ] **Step 1: Implement `src/pages/ClienteDetalhe.tsx`**

```tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchHistorico } from '../api/sheets'
import type { CheckIn } from '../types'
import { StatusBadge } from '../components/StatusBadge'
import { EvolucaoChart } from '../components/EvolucaoChart'

export function ClienteDetalhe() {
  const { clienteNome } = useParams<{ clienteNome: string }>()
  const navigate = useNavigate()
  const [history, setHistory] = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!clienteNome) return
    setLoading(true)
    fetchHistorico(decodeURIComponent(clienteNome))
      .then(setHistory)
      .catch(() => setError('Erro ao carregar histórico.'))
      .finally(() => setLoading(false))
  }, [clienteNome])

  const current = history[0]
  const nome = clienteNome ? decodeURIComponent(clienteNome) : ''

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'var(--surface-2)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '12px', padding: 0 }}
          >
            ← Dashboard
          </button>
          <span style={{ color: 'var(--border)' }}>|</span>
          <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '15px' }}>{nome}</span>
          {current && <StatusBadge status={current.statusFinal} />}
        </div>
        {current && (
          <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
            Account: {current.account}
          </span>
        )}
      </header>

      <main style={{ padding: '16px 20px' }}>
        {loading && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
            Carregando histórico...
          </p>
        )}

        {error && (
          <p style={{ color: 'var(--danger)', textAlign: 'center', padding: '40px' }}>{error}</p>
        )}

        {!loading && !error && history.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
            Nenhum dado encontrado para este cliente.
          </p>
        )}

        {!loading && !error && history.length > 0 && (
          <>
            {/* Chart */}
            <section style={{ marginBottom: '24px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Evolução do Status Final
              </p>
              <div style={{ backgroundColor: 'var(--surface-2)', borderRadius: '6px', padding: '12px 12px 4px' }}>
                <EvolucaoChart history={history} />
              </div>
            </section>

            {/* History table */}
            <section>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Histórico de Check-ins
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-dim)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                      {['Data', 'Status Final', 'Resultados', 'Relacionamento', 'Entregas'].map(h => (
                        <th key={h} style={{ padding: '6px 8px', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((c, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #1e1e1e' }}>
                        <td style={{ padding: '7px 8px', color: 'var(--text-muted)' }}>{c.data}</td>
                        <td style={{ padding: '7px 8px' }}><StatusBadge status={c.statusFinal} /></td>
                        <td style={{ padding: '7px 8px', color: 'var(--text-muted)' }}>
                          {c.statusResultados} ({c.scoreResultados})
                        </td>
                        <td style={{ padding: '7px 8px', color: 'var(--text-muted)' }}>
                          {c.statusRelacionamento} ({c.scoreRelacionamento})
                        </td>
                        <td style={{ padding: '7px 8px', color: 'var(--text-muted)' }}>
                          {c.statusEntregas} ({c.scoreEntregas})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/ClienteDetalhe.tsx
git commit -m "feat: ClienteDetalhe page with chart and history table"
```

---

## Task 10: Wire up App router and clean up

**Files:**
- Modify: `src/App.tsx`
- Delete: `src/App.css` (generated by Vite, not needed)

- [ ] **Step 1: Replace `src/App.tsx`**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { ClienteDetalhe } from './pages/ClienteDetalhe'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cliente/:clienteNome" element={<ClienteDetalhe />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: Delete generated files not in use**

Delete `src/App.css` and `src/assets/react.svg` and update `index.html` title:

In `index.html`, change:
```html
<title>Vite + React + TS</title>
```
to:
```html
<title>Health Score Dashboard</title>
```

- [ ] **Step 3: Run full test suite**

```bash
npm test
```
Expected: All tests PASS.

- [ ] **Step 4: Run dev server and verify both routes work**

```bash
npm run dev
```

Manually check:
- `http://localhost:5173/` loads dashboard (may show loading then error if Sheets not reachable yet — that's fine, confirm the UI renders)
- `http://localhost:5173/cliente/Empresa%20ABC` loads detail page

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx index.html
git rm src/App.css src/assets/react.svg
git commit -m "feat: wire up React Router and clean generated files"
```

---

## Task 11: Build, deploy, and verify

**Files:**
- No code changes — deploy and verify

- [ ] **Step 1: Run production build**

```bash
npm run build
```
Expected: `dist/` directory created, no TypeScript errors.

- [ ] **Step 2: Preview the production build locally**

```bash
npm run preview
```
Open `http://localhost:4173` and confirm both routes work. Check that navigating to `/cliente/X` directly doesn't 404 (it won't locally since preview serves `index.html` for all routes — Vercel will do the same via `vercel.json`).

- [ ] **Step 3: Push to GitHub**

```bash
git remote add origin https://github.com/<your-username>/health-score-dashboard.git
git push -u origin main
```

- [ ] **Step 4: Deploy on Vercel**

1. Go to vercel.com → New Project → Import Git Repository
2. Select `health-score-dashboard`
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variables:
   - `VITE_SHEETS_ID` = `1tKttwrjDWqjX7T7NxNfj-k1GctyaA91o0O7nNLYNwsk`
   - `VITE_SHEETS_API_KEY` = `AIzaSyC0Ui1ho9INokD7gZ9cfloqXKluknVkIPU`
7. Click Deploy

- [ ] **Step 5: Verify the deployed URL**

After deploy completes:
- Open the Vercel URL (e.g. `https://health-score-dashboard-xxxx.vercel.app`)
- Confirm dashboard loads with real client data from Sheets
- Click a client card → confirm detail page opens and chart renders
- Click "← Dashboard" → confirm navigation back works
- Click "↻ Atualizar" → confirm data refreshes

- [ ] **Step 6: Ensure Google Sheets is public**

In Google Sheets: Share → Change to "Anyone with the link" → Viewer. Without this the API key requests will return 403.
