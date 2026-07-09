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
