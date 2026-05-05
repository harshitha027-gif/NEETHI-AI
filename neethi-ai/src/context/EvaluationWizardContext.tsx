import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface Bidder {
  id: number
  name: string
  files: number
  fileNames?: string[]
  isDragging?: boolean
}

interface WizardState {
  tenderName: string
  tenderRef: string
  uploadedFileName: string
  bidders: Bidder[]
  bidFiles: Record<number, File[]>
  setTenderDetails: (name: string, ref: string, fileName: string) => void
  setBidders: (bidders: Bidder[]) => void
  setBidFiles: (bidderId: number, files: File[]) => void
  reset: () => void
}

const EvaluationWizardContext = createContext<WizardState | null>(null)

const DEFAULT_BIDDERS: Bidder[] = [
  { id: 1, name: 'Hassan Infra Projects Ltd.', files: 12, fileNames: ['bid_package_hassan.pdf'] },
  { id: 2, name: 'Mysuru Urban Solutions Corp.', files: 8, fileNames: ['mysuru_bid_docs.pdf'] },
]

export function EvaluationWizardProvider({ children }: { children: ReactNode }) {
  const [tenderName, setTenderName] = useState('')
  const [tenderRef, setTenderRef] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [bidders, setBiddersState] = useState<Bidder[]>(DEFAULT_BIDDERS)
  const [bidFiles, setBidFilesState] = useState<Record<number, File[]>>({})

  function setTenderDetails(name: string, ref: string, fileName: string) {
    setTenderName(name)
    setTenderRef(ref)
    setUploadedFileName(fileName)
  }

  function setBidders(b: Bidder[]) {
    setBiddersState(b)
  }

  function setBidFiles(bidderId: number, files: File[]) {
    setBidFilesState(prev => ({ ...prev, [bidderId]: files }))
  }

  function reset() {
    setTenderName('')
    setTenderRef('')
    setUploadedFileName('')
    setBiddersState(DEFAULT_BIDDERS)
    setBidFilesState({})
  }

  return (
    <EvaluationWizardContext.Provider
      value={{ tenderName, tenderRef, uploadedFileName, bidders, bidFiles, setTenderDetails, setBidders, setBidFiles, reset }}
    >
      {children}
    </EvaluationWizardContext.Provider>
  )
}

export function useEvaluationWizard() {
  const ctx = useContext(EvaluationWizardContext)
  if (!ctx) throw new Error('useEvaluationWizard must be used inside EvaluationWizardProvider')
  return ctx
}
