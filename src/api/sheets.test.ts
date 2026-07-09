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
