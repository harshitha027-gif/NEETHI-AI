import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { evaluateBid } from '../lib/geminiEvaluator'

// Minimal valid PDF bytes (real PDF structure)
function makeFakePDF(): File {
  const content = '%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF'
  return new File([content], 'bid.pdf', { type: 'application/pdf' })
}

const MOCK_GEMINI_RESPONSE = {
  candidates: [{
    content: {
      parts: [{
        text: JSON.stringify({
          verdict: 'eligible',
          confidence: 92,
          bidAmount: 'Rs.44.2 Crore',
          language: 'english',
          vendorNameKannada: null,
          criteria: {
            C1: { status: 'pass', confidence: 95, note: 'Turnover Rs.12.4Cr FY23' },
            C2: { status: 'pass', confidence: 93, note: 'ISO cert valid' },
            C3: { status: 'pass', confidence: 91, note: 'PWD reg confirmed' },
            C4: { status: 'pass', confidence: 90, note: '7 projects documented' },
            C5: { status: 'pass', confidence: 99, note: 'GSTIN valid' },
            C6: { status: 'pass', confidence: 88, note: 'BLS cert present' },
          },
          failReasons: [],
        })
      }]
    }
  }]
}

describe('geminiEvaluator', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls Gemini API with correct model URL', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_GEMINI_RESPONSE,
    } as Response)

    await evaluateBid('BID-001', 'Rajesh Infra', makeFakePDF())

    const [url] = vi.mocked(fetch).mock.calls[0]
    expect(url).toContain('gemma-4-31b-it')
    expect(url).toContain('generateContent')
  })

  it('sends PDF as base64 inlineData in request body', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_GEMINI_RESPONSE,
    } as Response)

    await evaluateBid('BID-001', 'Rajesh Infra', makeFakePDF())

    const [, options] = vi.mocked(fetch).mock.calls[0]
    const body = JSON.parse(options!.body as string)
    const parts = body.contents[0].parts
    const inlinePart = parts.find((p: any) => p.inlineData)
    expect(inlinePart).toBeDefined()
    expect(inlinePart.inlineData.mimeType).toBe('application/pdf')
    expect(typeof inlinePart.inlineData.data).toBe('string')
    expect(inlinePart.inlineData.data.length).toBeGreaterThan(0)
  })

  it('returns correct BidResult shape from Gemini response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_GEMINI_RESPONSE,
    } as Response)

    const result = await evaluateBid('BID-001', 'Rajesh Infra', makeFakePDF())

    expect(result.id).toBe('BID-001')
    expect(result.vendorName).toBe('Rajesh Infra')
    expect(result.verdict).toBe('eligible')
    expect(result.confidence).toBe(92)
    expect(result.criteria).toHaveProperty('C1')
    expect(result.criteria.C1.status).toBe('pass')
    expect(result.failReasons).toEqual([])
  })

  it('returns review verdict and empty criteria on API error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'Bad Request',
    } as Response)

    await expect(evaluateBid('BID-001', 'Test Bidder', makeFakePDF()))
      .rejects.toThrow('Gemini API 400')
  })

  it('handles ineligible verdict with failReasons', async () => {
    const ineligibleResponse = {
      candidates: [{
        content: {
          parts: [{
            text: JSON.stringify({
              verdict: 'ineligible',
              confidence: 88,
              bidAmount: 'Rs.30 Crore',
              language: 'english',
              vendorNameKannada: null,
              criteria: {
                C1: { status: 'fail', confidence: 90, note: 'Turnover only Rs.2Cr — below Rs.5Cr threshold' },
                C2: { status: 'pass', confidence: 85, note: 'ISO cert valid' },
                C3: { status: 'fail', confidence: 87, note: 'PWD registration not found' },
                C4: { status: 'pass', confidence: 80, note: 'Experience documented' },
                C5: { status: 'pass', confidence: 95, note: 'GSTIN valid' },
                C6: { status: 'fail', confidence: 99, note: 'Not submitted' },
              },
              failReasons: ['C1: Annual turnover below minimum', 'C3: No PWD Class I registration'],
            })
          }]
        }
      }]
    }

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ineligibleResponse,
    } as Response)

    const result = await evaluateBid('BID-002', 'Low Turnover Corp', makeFakePDF())

    expect(result.verdict).toBe('ineligible')
    expect(result.criteria.C1.status).toBe('fail')
    expect(result.failReasons).toHaveLength(2)
    expect(result.failReasons[0]).toContain('C1')
  })

  it('defaults to review verdict when Gemini returns missing fields', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: JSON.stringify({}) }] } }]
      }),
    } as Response)

    const result = await evaluateBid('BID-003', 'Unknown Bidder', makeFakePDF())

    expect(result.verdict).toBe('review')
    expect(result.confidence).toBe(50)
    expect(result.failReasons).toEqual([])
  })
})
