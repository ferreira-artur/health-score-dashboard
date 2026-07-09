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
