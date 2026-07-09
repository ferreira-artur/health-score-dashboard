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
