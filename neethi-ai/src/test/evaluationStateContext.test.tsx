import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { EvaluationStateProvider, useEvaluationState } from '../context/EvaluationStateContext'

function Inspector() {
  const { resolvedBids, realBids } = useEvaluationState()
  return (
    <div>
      <span data-testid="resolved-count">{resolvedBids.length}</span>
      <span data-testid="real-bids">{realBids === null ? 'null' : realBids.length}</span>
    </div>
  )
}

function Controls() {
  const { resolveReview, setRealBids, resetEvaluation } = useEvaluationState()
  return (
    <>
      <button onClick={() => resolveReview('BID-014')}>resolve</button>
      <button onClick={() => setRealBids([
        { id: 'BID-LIVE-001', vendorName: 'Test Vendor', vendorNameKannada: null, language: 'english', bidAmount: 'N/A', verdict: 'eligible', confidence: 90, criteria: {}, failReasons: [] }
      ])}>set-real</button>
      <button onClick={() => resetEvaluation()}>reset</button>
    </>
  )
}

function App() {
  return (
    <EvaluationStateProvider>
      <Inspector />
      <Controls />
    </EvaluationStateProvider>
  )
}

describe('EvaluationStateContext', () => {
  it('starts with empty resolvedBids and null realBids', () => {
    render(<App />)
    expect(screen.getByTestId('resolved-count').textContent).toBe('0')
    expect(screen.getByTestId('real-bids').textContent).toBe('null')
  })

  it('resolveReview adds bidId to resolvedBids', async () => {
    render(<App />)
    await act(async () => screen.getByText('resolve').click())
    expect(screen.getByTestId('resolved-count').textContent).toBe('1')
  })

  it('resolveReview does not add duplicate bidId', async () => {
    render(<App />)
    await act(async () => { screen.getByText('resolve').click() })
    await act(async () => { screen.getByText('resolve').click() })
    expect(screen.getByTestId('resolved-count').textContent).toBe('1')
  })

  it('setRealBids stores results and shows count', async () => {
    render(<App />)
    await act(async () => screen.getByText('set-real').click())
    expect(screen.getByTestId('real-bids').textContent).toBe('1')
  })

  it('resetEvaluation clears both resolvedBids and realBids', async () => {
    render(<App />)
    await act(async () => { screen.getByText('resolve').click() })
    await act(async () => { screen.getByText('set-real').click() })
    await act(async () => { screen.getByText('reset').click() })
    expect(screen.getByTestId('resolved-count').textContent).toBe('0')
    expect(screen.getByTestId('real-bids').textContent).toBe('null')
  })
})
