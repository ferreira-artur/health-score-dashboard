import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ClienteCard } from './ClienteCard'
import type { CheckIn } from '../types'

const DANGER_CHECKIN: CheckIn = {
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
  calculadoEm: '',
}

describe('ClienteCard', () => {
  it('renders client name and account', () => {
    render(<ClienteCard checkIn={DANGER_CHECKIN} onClick={() => {}} />)
    expect(screen.getByText(/Empresa ABC/)).toBeInTheDocument()
    expect(screen.getByText(/Ana Lima/)).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<ClienteCard checkIn={DANGER_CHECKIN} onClick={handleClick} />)
    fireEvent.click(screen.getByRole('article'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
