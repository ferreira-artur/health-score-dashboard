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
