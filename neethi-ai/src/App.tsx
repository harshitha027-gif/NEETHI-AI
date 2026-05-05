import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { EvaluationWizardProvider } from './context/EvaluationWizardContext'
import { EvaluationStateProvider } from './context/EvaluationStateContext'
import LandingPage from './pages/LandingPage.tsx'
import OfficerDashboard from './pages/OfficerDashboard.tsx'
import VerdictDashboard from './pages/VerdictDashboard.tsx'
import BidDetails from './pages/BidDetails.tsx'
import BidDetailsEligible from './pages/BidDetailsEligible.jsx'
import BidDetailsIneligible from './pages/BidDetailsIneligible.jsx'
import BidDetailsManualReview from './pages/BidDetailsManualReview.jsx'
import AuditTrail from './pages/AuditTrail.tsx'
import KtppReport from './pages/KtppReport.tsx'
import Step1UploadTender from './pages/wizard/Step1UploadTender.jsx'
import Step2UploadBids from './pages/wizard/Step2UploadBids.jsx'
import Step3ConfirmCriteria from './pages/wizard/Step3ConfirmCriteria.jsx'
import EvaluationInProgress from './pages/wizard/EvaluationInProgress.jsx'
import EvaluationSignOff from './pages/wizard/EvaluationSignOff.jsx'
import AuditLogSearch from './pages/AuditLogSearch.jsx'
import ProcessingError from './pages/ProcessingError.jsx'
import UserManagement from './pages/UserManagement.jsx'
import Analytics from './pages/Analytics.tsx'
import Settings from './pages/Settings.tsx'

export default function App() {
  return (
    <EvaluationStateProvider>
    <EvaluationWizardProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<OfficerDashboard />} />
        <Route path="/evaluation/new/step1" element={<Step1UploadTender />} />
        <Route path="/evaluation/new/step2" element={<Step2UploadBids />} />
        <Route path="/evaluation/new/step3" element={<Step3ConfirmCriteria />} />
        <Route path="/evaluation/:evaluationId/processing" element={<EvaluationInProgress />} />
        <Route path="/evaluation/:evaluationId/error" element={<ProcessingError />} />
        <Route path="/evaluation/:evaluationId/signoff" element={<EvaluationSignOff />} />
        <Route path="/evaluation/:evaluationId" element={<VerdictDashboard />} />
        <Route path="/bid/:bidId" element={<BidDetails />} />
        <Route path="/bid/:bidId/eligible" element={<BidDetailsEligible />} />
        <Route path="/bid/:bidId/ineligible" element={<BidDetailsIneligible />} />
        <Route path="/bid/:bidId/manual-review" element={<BidDetailsManualReview />} />
        <Route path="/audit/:evaluationId" element={<AuditTrail />} />
        <Route path="/audit-log/search" element={<AuditLogSearch />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/report/:evaluationId" element={<KtppReport />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
    </EvaluationWizardProvider>
    </EvaluationStateProvider>
  )
}
