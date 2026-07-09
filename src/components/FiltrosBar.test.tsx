import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FiltrosBar } from './FiltrosBar'

describe('FiltrosBar', () => {
  const defaultProps = {
    statusFilter: 'Todos' as const,
    onStatusFilter: vi.fn(),
    searchText: '',
    onSearchText: vi.fn(),
    accountFilter: 'Todos',
    onAccountFilter: vi.fn(),
    accounts: ['Ana Lima', 'Bruno Costa'],
  }

  it('renders all status filter buttons', () => {
    render(<FiltrosBar {...defaultProps} />)
    expect(screen.getByText('Todos')).toBeInTheDocument()
    expect(screen.getByText('DANGER')).toBeInTheDocument()
    expect(screen.getByText('CARE')).toBeInTheDocument()
    expect(screen.getByText('SAFE')).toBeInTheDocument()
  })

  it('calls onSearchText when typing in search field', () => {
    const onSearchText = vi.fn()
    render(<FiltrosBar {...defaultProps} onSearchText={onSearchText} />)
    fireEvent.change(screen.getByPlaceholderText(/Buscar cliente/i), {
      target: { value: 'ABC' },
    })
    expect(onSearchText).toHaveBeenCalledWith('ABC')
  })

  it('renders account options in dropdown', () => {
    render(<FiltrosBar {...defaultProps} />)
    expect(screen.getByText('Ana Lima')).toBeInTheDocument()
    expect(screen.getByText('Bruno Costa')).toBeInTheDocument()
  })

  it('calls onStatusFilter when a pill button is clicked', () => {
    const onStatusFilter = vi.fn()
    render(<FiltrosBar {...defaultProps} onStatusFilter={onStatusFilter} />)
    fireEvent.click(screen.getByText('DANGER'))
    expect(onStatusFilter).toHaveBeenCalledWith('DANGER')
  })

  it('calls onAccountFilter when account is selected', () => {
    const onAccountFilter = vi.fn()
    render(<FiltrosBar {...defaultProps} onAccountFilter={onAccountFilter} />)
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Ana Lima' },
    })
    expect(onAccountFilter).toHaveBeenCalledWith('Ana Lima')
  })
})
