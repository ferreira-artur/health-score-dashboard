import type { CheckIn, StatusDimensao, StatusFinal } from '../types'

const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets'
const SHEET_ID = '1tKttwrjDWqjX7T7NxNfj-k1GctyaA91o0O7nNLYNwsk'
const API_KEY = 'AIzaSyC0Ui1ho9INokD7gZ9cfloqXKluknVkIPU'

const VALID_STATUS_FINAL = new Set<string>(['SAFE', 'CARE', 'DANGER'])
const VALID_STATUS_DIMENSAO = new Set<string>(['🟢 BOM', '🟡 NORMAL', '🔴 RUIM'])

function toStatusFinal(v: string): StatusFinal {
  // Sheets may return "🟡 CARE", "🟢 SAFE", "🔴 DANGER" — strip emoji prefix
  const normalized = v.includes(' ') ? v.split(' ').pop()! : v
  if (!VALID_STATUS_FINAL.has(normalized)) throw new Error(`Invalid StatusFinal: "${v}"`)
  return normalized as StatusFinal
}

function toStatusDimensao(v: string): StatusDimensao {
  if (!VALID_STATUS_DIMENSAO.has(v)) throw new Error(`Invalid StatusDimensao: "${v}"`)
  return v as StatusDimensao
}

export function parseRow(row: string[]): CheckIn {
  return {
    data: row[0] ?? '',
    cliente: row[1] ?? '',
    account: row[2] ?? '',
    scoreResultados: parseFloat(row[3]) || 0,
    statusResultados: toStatusDimensao(row[4]),
    scoreRelacionamento: parseFloat(row[5]) || 0,
    statusRelacionamento: toStatusDimensao(row[6]),
    scoreEntregas: parseFloat(row[7]) || 0,
    statusEntregas: toStatusDimensao(row[8]),
    statusFinal: toStatusFinal(row[9]),
    calculadoEm: row[10] ?? '',
  }
}

async function fetchRange(range: string): Promise<string[][]> {
  const url = `${SHEETS_BASE}/${SHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sheets API error: ${res.status}`)
  const data = await res.json()
  console.log('[sheets] raw response for range:', range)
  console.log('[sheets] values field present:', 'values' in data)
  console.log('[sheets] first 2 rows:', JSON.stringify(data.values?.slice(0, 2)))
  return data.values ?? []
}

let statusAtualInflight: Promise<CheckIn[]> | null = null
let historicoInflight: Promise<string[][]> | null = null

export function clearCache() {
  statusAtualInflight = null
  historicoInflight = null
}

export function fetchStatusAtual(): Promise<CheckIn[]> {
  console.log('[sheets] fetchStatusAtual called, cache:', statusAtualInflight ? 'HIT' : 'MISS')
  if (!statusAtualInflight) {
    statusAtualInflight = fetchRange('Status Atual!A2:K')
      .then(rows => {
        console.log('[sheets] total rows received:', rows.length)
        console.log('[sheets] first row:', JSON.stringify(rows[0]))
        const valid = rows.filter(r => r.length >= 11)
        console.log('[sheets] rows passing length>=11 filter:', valid.length)
        const results: CheckIn[] = []
        for (let i = 0; i < valid.length; i++) {
          try {
            results.push(parseRow(valid[i]))
          } catch (e) {
            console.error(`[sheets] parseRow failed on row ${i}:`, JSON.stringify(valid[i]), e instanceof Error ? e.message : e)
            throw e
          }
        }
        console.log('[sheets] parsing complete, clients:', results.length)
        return results
      })
      .catch(e => {
        console.error('[sheets] fetchStatusAtual rejected:', e instanceof Error ? e.message : e)
        statusAtualInflight = null
        throw e
      })
  }
  return statusAtualInflight
}

export async function fetchHistorico(clienteNome: string): Promise<CheckIn[]> {
  if (!historicoInflight) {
    historicoInflight = fetchRange('Health Score!A2:K')
  }
  const rows = await historicoInflight
  return rows
    .filter(r => r.length >= 11 && r[1] === clienteNome)
    .map(parseRow)
    .sort((a, b) => {
      const toDate = (d: string) => {
        if (!d) return 0
        const [day, month, year] = d.split('/')
        const t = new Date(`${year}-${month}-${day}`).getTime()
        return isNaN(t) ? 0 : t
      }
      return toDate(b.data) - toDate(a.data)
    })
}
