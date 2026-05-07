import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Lang = 'en' | 'kn'

const DICT: Record<string, { en: string; kn: string }> = {
  // Brand & global
  'brand.tagline':            { en: 'Neural Evaluation Engine for Transparent & Honest Inquiry', kn: 'ಪಾರದರ್ಶಕ ಮತ್ತು ಪ್ರಾಮಾಣಿಕ ವಿಚಾರಣೆಗಾಗಿ ನ್ಯೂರಲ್ ಮೌಲ್ಯಮಾಪನ' },
  'nav.openDemo':              { en: 'Open Demo →', kn: 'ಡೆಮೋ ತೆರೆಯಿರಿ →' },

  // Top nav
  'topnav.dashboard':          { en: 'Dashboard',     kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' },
  'topnav.tenders':            { en: 'Tenders',       kn: 'ಟೆಂಡರ್‌ಗಳು' },
  'topnav.analytics':          { en: 'Analytics',     kn: 'ವಿಶ್ಲೇಷಣೆ' },
  'topnav.auditLog':           { en: 'Audit Log',     kn: 'ಆಡಿಟ್ ದಾಖಲೆ' },

  // Sidebar
  'sidebar.newEval':           { en: 'New Evaluation',   kn: 'ಹೊಸ ಮೌಲ್ಯಮಾಪನ' },
  'sidebar.dashboard':         { en: 'Dashboard',        kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' },
  'sidebar.auditLog':          { en: 'Audit Log',        kn: 'ಆಡಿಟ್ ದಾಖಲೆ' },
  'sidebar.settings':          { en: 'Settings',         kn: 'ಸೆಟ್ಟಿಂಗ್ಸ್' },
  'sidebar.logout':            { en: 'Logout',           kn: 'ಲಾಗ್‌ಔಟ್' },

  // Officer Dashboard
  'dash.title':                { en: 'Procurement Workspace', kn: 'ಖರೀದಿ ಕಾರ್ಯಸ್ಥಳ' },
  'dash.subtitle':             { en: 'Institutional oversight for state-wide tender evaluations.', kn: 'ರಾಜ್ಯಾದ್ಯಂತ ಟೆಂಡರ್ ಮೌಲ್ಯಮಾಪನಗಳಿಗೆ ಸಾಂಸ್ಥಿಕ ಮೇಲ್ವಿಚಾರಣೆ.' },
  'dash.filter':               { en: 'Filter',           kn: 'ಫಿಲ್ಟರ್' },
  'dash.exportReport':         { en: 'Export Report',    kn: 'ವರದಿ ರಫ್ತು' },
  'dash.attentionReq':         { en: 'Attention Required', kn: 'ಗಮನ ಅಗತ್ಯ' },
  'dash.readyForReview':       { en: 'Ready for Review', kn: 'ಪರಿಶೀಲನೆಗೆ ಸಿದ್ಧ' },
  'dash.aiPassDone':           { en: 'AI evaluation pass completed for these tenders.', kn: 'ಈ ಟೆಂಡರ್‌ಗಳಿಗೆ AI ಮೌಲ್ಯಮಾಪನ ಪೂರ್ಣಗೊಂಡಿದೆ.' },
  'dash.monthlyPerf':          { en: 'Monthly Performance', kn: 'ಮಾಸಿಕ ಕಾರ್ಯಕ್ಷಮತೆ' },
  'dash.completedThisMonth':   { en: 'Completed This Month', kn: 'ಈ ತಿಂಗಳು ಪೂರ್ಣಗೊಂಡಿದೆ' },
  'dash.queueStatus':          { en: 'Queue Status',     kn: 'ಸರತಿ ಸ್ಥಿತಿ' },
  'dash.processing':           { en: 'Processing',       kn: 'ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ' },
  'dash.activeEvals':          { en: 'Active Evaluations', kn: 'ಸಕ್ರಿಯ ಮೌಲ್ಯಮಾಪನಗಳು' },
  'dash.searchTenders':        { en: 'Search tenders...', kn: 'ಟೆಂಡರ್ ಹುಡುಕಿ...' },
  'dash.col.tenderId':         { en: 'Tender ID',        kn: 'ಟೆಂಡರ್ ID' },
  'dash.col.tenderName':       { en: 'Tender Name',      kn: 'ಟೆಂಡರ್ ಹೆಸರು' },
  'dash.col.uploadDate':       { en: 'Upload Date',      kn: 'ಅಪ್‌ಲೋಡ್ ದಿನಾಂಕ' },
  'dash.col.totalBids':        { en: 'Total Bids',       kn: 'ಒಟ್ಟು ಬಿಡ್‌ಗಳು' },
  'dash.col.status':           { en: 'Status',           kn: 'ಸ್ಥಿತಿ' },
  'dash.col.action':           { en: 'Action',           kn: 'ಕ್ರಿಯೆ' },
  'dash.startReview':          { en: 'Start Review',     kn: 'ಪರಿಶೀಲನೆ ಆರಂಭಿಸಿ' },
  'dash.viewLogs':             { en: 'View Logs',        kn: 'ಲಾಗ್‌ಗಳನ್ನು ನೋಡಿ' },
  'dash.downloadReport':       { en: 'Download Report',  kn: 'ವರದಿ ಡೌನ್‌ಲೋಡ್' },
  'dash.completed':            { en: 'Completed',        kn: 'ಪೂರ್ಣಗೊಂಡಿದೆ' },

  // Landing
  'land.badge':                { en: 'CRPF Hackathon 2024 — Theme 3', kn: 'CRPF ಹ್ಯಾಕಥಾನ್ 2024 — ಥೀಮ್ 3' },
  'land.heroTitle1':           { en: 'AI-Powered Tender Evaluation', kn: 'AI-ಚಾಲಿತ ಟೆಂಡರ್ ಮೌಲ್ಯಮಾಪನ' },
  'land.heroTitle2':           { en: 'for Karnataka Government', kn: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಕ್ಕಾಗಿ' },
  'land.heroSub':              { en: 'Seamlessly processing Kannada and English bids with full KTPP Act 2000 compliance.', kn: 'ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಬಿಡ್‌ಗಳನ್ನು ಸಂಪೂರ್ಣ KTPP ಕಾಯ್ದೆ 2000 ಅನುಸರಣೆಯೊಂದಿಗೆ ಸುಲಭವಾಗಿ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುವುದು.' },
  'land.openOfficer':          { en: 'Open Officer Dashboard', kn: 'ಅಧಿಕಾರಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ' },
  'land.liveDemo':             { en: 'Live demo — pre-loaded with Karnataka tender sample data', kn: 'ಲೈವ್ ಡೆಮೊ — ಕರ್ನಾಟಕ ಟೆಂಡರ್ ಮಾದರಿ ಡೇಟಾದೊಂದಿಗೆ ಪೂರ್ವ-ಲೋಡ್‌ಗೊಂಡಿದೆ' },

  // Onboarding
  'tour.skip':                 { en: 'Skip Tour',        kn: 'ಟೂರ್ ಬಿಟ್ಟುಬಿಡಿ' },
  'tour.next':                 { en: 'Next',             kn: 'ಮುಂದೆ' },
  'tour.back':                 { en: 'Back',             kn: 'ಹಿಂದೆ' },
  'tour.done':                 { en: 'Got it',           kn: 'ಸರಿ' },
  'tour.welcome.title':        { en: 'Welcome to NEETHI AI', kn: 'NEETHI AI ಗೆ ಸ್ವಾಗತ' },
  'tour.welcome.body':         { en: 'AI-powered tender evaluation. Quick 30-second tour?', kn: 'AI-ಚಾಲಿತ ಟೆಂಡರ್ ಮೌಲ್ಯಮಾಪನ. 30 ಸೆಕೆಂಡ್ ಪರಿಚಯ?' },
  'tour.newEval.title':        { en: 'Start a New Evaluation', kn: 'ಹೊಸ ಮೌಲ್ಯಮಾಪನ ಆರಂಭಿಸಿ' },
  'tour.newEval.body':         { en: 'Click here to upload a tender and bid documents for AI analysis.', kn: 'ಟೆಂಡರ್ ಮತ್ತು ಬಿಡ್ ಡಾಕ್ಯುಮೆಂಟ್‌ಗಳನ್ನು AI ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ.' },
  'tour.evals.title':          { en: 'Your Active Evaluations', kn: 'ನಿಮ್ಮ ಸಕ್ರಿಯ ಮೌಲ್ಯಮಾಪನಗಳು' },
  'tour.evals.body':           { en: 'Live tenders ready for review or under processing show up here.', kn: 'ಪರಿಶೀಲನೆಗೆ ಸಿದ್ಧ ಅಥವಾ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿರುವ ಟೆಂಡರ್‌ಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.' },
  'tour.lang.title':           { en: 'Language Toggle', kn: 'ಭಾಷಾ ಟಾಗಲ್' },
  'tour.lang.body':            { en: 'Switch between English and ಕನ್ನಡ anytime.', kn: 'ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಇಂಗ್ಲಿಷ್ ಮತ್ತು ಕನ್ನಡ ನಡುವೆ ಬದಲಿಸಿ.' },
  'tour.help.title':           { en: 'Help & Notifications', kn: 'ಸಹಾಯ ಮತ್ತು ಅಧಿಸೂಚನೆಗಳು' },
  'tour.help.body':            { en: 'Bell shows alerts. ? icon opens documentation and contact info.', kn: 'ಬೆಲ್ ಎಚ್ಚರಿಕೆಗಳನ್ನು ತೋರಿಸುತ್ತದೆ. ? ಐಕಾನ್ ಡಾಕ್ಯುಮೆಂಟೇಶನ್ ತೆರೆಯುತ್ತದೆ.' },
}

interface I18nContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

const STORAGE_KEY = 'neethi-lang'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en'
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved === 'kn' ? 'kn' : 'en'
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  const setLang = (l: Lang) => setLangState(l)

  const t = (key: string) => {
    const entry = DICT[key]
    if (!entry) return key
    return entry[lang] || entry.en
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
