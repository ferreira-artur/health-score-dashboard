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
