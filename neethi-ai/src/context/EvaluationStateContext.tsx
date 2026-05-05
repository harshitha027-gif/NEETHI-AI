import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { BidResult } from '../lib/geminiEvaluator'

interface EvaluationState {
  resolvedBids: string[]
  realBids: BidResult[] | null
  resolveReview: (bidId: string) => void
  resetEvaluation: () => void
  setRealBids: (bids: BidResult[]) => void
}

const EvaluationStateContext = createContext<EvaluationState | null>(null)

export function EvaluationStateProvider({ children }: { children: ReactNode }) {
  const [resolvedBids, setResolvedBids] = useState<string[]>([])
  const [realBids, setRealBidsState] = useState<BidResult[] | null>(null)

  function resolveReview(bidId: string) {
    setResolvedBids(prev => prev.includes(bidId) ? prev : [...prev, bidId])
  }

  function resetEvaluation() {
    setResolvedBids([])
    setRealBidsState(null)
  }

  function setRealBids(bids: BidResult[]) {
    setRealBidsState(bids)
  }

  return (
    <EvaluationStateContext.Provider value={{ resolvedBids, realBids, resolveReview, resetEvaluation, setRealBids }}>
      {children}
    </EvaluationStateContext.Provider>
  )
}

export function useEvaluationState() {
  const ctx = useContext(EvaluationStateContext)
  if (!ctx) throw new Error('useEvaluationState must be used inside EvaluationStateProvider')
  return ctx
}
