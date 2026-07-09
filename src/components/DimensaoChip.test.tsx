import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DimensaoChip } from './DimensaoChip'

describe('DimensaoChip', () => {
  it('renders the status text', () => {
    render(<DimensaoChip label="Resultados" status="🔴 RUIM" />)
    expect(screen.getByText(/Resultados/)).toBeInTheDocument()
    expect(screen.getByText(/🔴 RUIM/)).toBeInTheDocument()
  })
})
