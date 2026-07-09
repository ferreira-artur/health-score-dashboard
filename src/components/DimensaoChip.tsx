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
