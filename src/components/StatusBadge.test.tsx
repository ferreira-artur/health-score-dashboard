import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('renders DANGER with red background', () => {
    render(<StatusBadge status="DANGER" />)
    const badge = screen.getByText(/DANGER/)
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveStyle({ backgroundColor: 'rgb(229, 57, 53)' })
  })

  it('renders CARE with amber background', () => {
    render(<StatusBadge status="CARE" />)
    const badge = screen.getByText(/CARE/)
    expect(badge).toHaveStyle({ backgroundColor: 'rgb(249, 168, 37)' })
  })

  it('renders SAFE with green background', () => {
    render(<StatusBadge status="SAFE" />)
    const badge = screen.getByText(/SAFE/)
    expect(badge).toHaveStyle({ backgroundColor: 'rgb(67, 160, 71)' })
  })
})
