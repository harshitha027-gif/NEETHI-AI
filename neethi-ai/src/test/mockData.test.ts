import { describe, it, expect } from 'vitest'
import { BIDS, CRITERIA, TENDER } from '../data/mockData'

describe('mockData integrity', () => {
  it('has exactly 14 bids', () => {
    expect(BIDS).toHaveLength(14)
  })

  it('has correct verdict distribution: 11 eligible, 2 ineligible, 1 review', () => {
    const eligible   = BIDS.filter(b => b.verdict === 'eligible').length
    const ineligible = BIDS.filter(b => b.verdict === 'ineligible').length
    const review     = BIDS.filter(b => b.verdict === 'review').length
    expect(eligible).toBe(11)
    expect(ineligible).toBe(2)
    expect(review).toBe(1)
  })

  it('Kannada ratio is at least 40% (demo requires 71%)', () => {
    const kannadaBids = BIDS.filter(b => b.language === 'kannada').length
    const ratio = kannadaBids / BIDS.length
    expect(ratio).toBeGreaterThanOrEqual(0.4)
    // Confirm actual 71% (10/14)
    expect(kannadaBids).toBe(10)
  })

  it('ineligible bids are BID-012 and BID-013', () => {
    const ineligibleIds = BIDS.filter(b => b.verdict === 'ineligible').map(b => b.id)
    expect(ineligibleIds).toContain('BID-012')
    expect(ineligibleIds).toContain('BID-013')
  })

  it('manual review bid is BID-014', () => {
    const reviewBid = BIDS.find(b => b.verdict === 'review')
    expect(reviewBid?.id).toBe('BID-014')
  })

  it('every bid has all 6 criteria (C1-C6)', () => {
    BIDS.forEach(bid => {
      expect(Object.keys(bid.criteria)).toEqual(expect.arrayContaining(['C1','C2','C3','C4','C5','C6']))
    })
  })

  it('every criterion has status, confidence, note', () => {
    BIDS.forEach(bid => {
      Object.values(bid.criteria).forEach(c => {
        expect(c).toHaveProperty('status')
        expect(c).toHaveProperty('confidence')
        expect(c).toHaveProperty('note')
        expect(['pass', 'fail', 'review']).toContain(c.status)
        expect(c.confidence).toBeGreaterThanOrEqual(0)
        expect(c.confidence).toBeLessThanOrEqual(100)
      })
    })
  })

  it('has 6 criteria definitions', () => {
    expect(CRITERIA).toHaveLength(6)
  })

  it('mandatory criteria are C1-C4', () => {
    const mandatory = CRITERIA.filter(c => c.type === 'Mandatory').map(c => c.id)
    expect(mandatory).toEqual(['C1', 'C2', 'C3', 'C4'])
  })

  it('TENDER evaluationId is EVAL-2024-001', () => {
    expect(TENDER.evaluationId).toBe('EVAL-2024-001')
  })

  it('eligible bids have all mandatory criteria passing', () => {
    const mandatoryIds = ['C1', 'C2', 'C3', 'C4']
    BIDS.filter(b => b.verdict === 'eligible').forEach(bid => {
      mandatoryIds.forEach(cId => {
        expect(bid.criteria[cId].status).toBe('pass')
      })
    })
  })
})
