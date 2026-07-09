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
