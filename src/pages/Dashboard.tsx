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
