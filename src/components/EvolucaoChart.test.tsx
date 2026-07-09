import { describe, it, expect } from 'vitest'
import { statusToY, yToLabel } from './EvolucaoChart'

describe('statusToY', () => {
  it('maps SAFE to 0 (top of chart)', () => {
    expect(statusToY('SAFE')).toBe(0)
  })
  it('maps CARE to 1', () => {
    expect(statusToY('CARE')).toBe(1)
  })
  it('maps DANGER to 2 (bottom of chart)', () => {
    expect(statusToY('DANGER')).toBe(2)
  })
})

describe('yToLabel', () => {
  it('returns SAFE for 0', () => {
    expect(yToLabel(0)).toBe('SAFE')
  })
  it('returns CARE for 1', () => {
    expect(yToLabel(1)).toBe('CARE')
  })
  it('returns DANGER for 2', () => {
    expect(yToLabel(2)).toBe('DANGER')
  })
})
