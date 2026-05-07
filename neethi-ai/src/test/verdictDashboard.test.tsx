import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { EvaluationStateProvider } from '../context/EvaluationStateContext'
import { I18nProvider } from '../context/I18nContext'
import VerdictDashboard from '../pages/VerdictDashboard'

vi.mock('../components/TopNavActions', () => ({
  default: () => null,
}))

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter initialEntries={['/evaluation/EVAL-2024-001']}>
      <I18nProvider>
        <EvaluationStateProvider>
          {children}
        </EvaluationStateProvider>
      </I18nProvider>
    </MemoryRouter>
  )
}

describe('VerdictDashboard — mockData mode', () => {
  it('shows 11 eligible (zero-padded) from mockData', () => {
    render(<Wrapper><VerdictDashboard /></Wrapper>)
    // counts use padStart(2,'0'): 11 stays "11"
    expect(screen.getByText('11')).toBeInTheDocument()
  })

  it('shows 02 ineligible (zero-padded) from mockData', () => {
    render(<Wrapper><VerdictDashboard /></Wrapper>)
    expect(screen.getByText('02')).toBeInTheDocument()
  })

  it('shows 01 manual review (zero-padded) from mockData', () => {
    render(<Wrapper><VerdictDashboard /></Wrapper>)
    expect(screen.getByText('01')).toBeInTheDocument()
  })

  it('shows "1 Pending" when manual review bid unresolved', () => {
    render(<Wrapper><VerdictDashboard /></Wrapper>)
    expect(screen.getByText('1 Pending')).toBeInTheDocument()
  })

  it('Sign Off button is disabled when manual review pending', () => {
    render(<Wrapper><VerdictDashboard /></Wrapper>)
    const signOff = screen.getByRole('button', { name: /sign off/i })
    expect(signOff).toBeDisabled()
  })

  it('shows "14 of 14 bidders" in All filter view', () => {
    render(<Wrapper><VerdictDashboard /></Wrapper>)
    // default filter is 'all' — footer shows "Showing 14 of 14 bidders"
    expect(screen.getByText(/14 of 14 bidders/i)).toBeInTheDocument()
  })

  it('filter Eligible shows 11 of 14 bidders', async () => {
    const user = userEvent.setup()
    render(<Wrapper><VerdictDashboard /></Wrapper>)
    await user.click(screen.getByRole('button', { name: /^eligible$/i }))
    expect(screen.getByText(/11 of 14 bidders/i)).toBeInTheDocument()
  })

  it('filter Ineligible shows 2 of 14 bidders', async () => {
    const user = userEvent.setup()
    render(<Wrapper><VerdictDashboard /></Wrapper>)
    await user.click(screen.getByRole('button', { name: /^ineligible$/i }))
    expect(screen.getByText(/2 of 14 bidders/i)).toBeInTheDocument()
  })

  it('filter Manual Review shows 1 of 14 bidders', async () => {
    const user = userEvent.setup()
    render(<Wrapper><VerdictDashboard /></Wrapper>)
    await user.click(screen.getByRole('button', { name: /manual review/i }))
    expect(screen.getByText(/1 of 14 bidders/i)).toBeInTheDocument()
  })

  it('renders vendor name from mockData', () => {
    render(<Wrapper><VerdictDashboard /></Wrapper>)
    expect(screen.getByText('Rajesh Infrastructure Pvt Ltd')).toBeInTheDocument()
  })

  it('Bulk Approve button renders and is clickable', async () => {
    const user = userEvent.setup()
    render(<Wrapper><VerdictDashboard /></Wrapper>)
    const bulk = screen.getByRole('button', { name: /bulk approve/i })
    expect(bulk).toBeInTheDocument()
    await user.click(bulk)
    expect(screen.getByText(/all eligible approved/i)).toBeInTheDocument()
  })
})
