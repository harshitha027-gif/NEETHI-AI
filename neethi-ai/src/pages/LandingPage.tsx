import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  Scale, Clock, Globe, AlertTriangle, Gavel,
  ShieldCheck, FileText, Lock, ArrowRight, CheckCircle,
} from 'lucide-react'

// --- Animated stat counter ---
function useCountUp(target: number, duration = 1400, active = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setVal(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])
  return val
}

// --- Intersection Observer fade-in ---
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

// --- Stats with counter ---
const RAW_STATS = [
  { num: 3000, suffix: '+', label: 'Tenders/year in Karnataka' },
  { num: 14, suffix: ' days', label: 'Max evaluation time' },
  { num: 68, suffix: '%', label: 'Submit in Kannada' },
  { num: 2983, suffix: '', label: 'Active HC Disputes' },
]

function StatBar() {
  const { ref, visible } = useFadeIn()
  const v0 = useCountUp(RAW_STATS[0].num, 1200, visible)
  const v1 = useCountUp(RAW_STATS[1].num, 900, visible)
  const v2 = useCountUp(RAW_STATS[2].num, 1000, visible)
  const v3 = useCountUp(RAW_STATS[3].num, 1600, visible)
  const vals = [v0, v1, v2, v3]

  return (
    <section ref={ref} className="bg-[#1A2E4A] py-5 border-y border-white/10">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4">
        {RAW_STATS.map((s, i) => (
          <div key={s.label} className={`text-center py-4 ${i < 3 ? 'border-r border-white/10' : ''}`}>
            <div className="text-white font-bold text-2xl tabular-nums">
              {visible ? vals[i].toLocaleString() : '0'}{s.suffix}
            </div>
            <div className="text-[#8296b7] text-[10px] font-bold uppercase tracking-widest mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// --- Problem cards ---
const PROBLEMS = [
  { icon: Clock,         title: 'Manual Delays',            desc: 'Months-long evaluation cycles hindering infrastructure growth across the state.' },
  { icon: Globe,         title: 'Silent Disqualifications',  desc: 'Language barriers leading to unfair technical rejections of local MSMEs.' },
  { icon: AlertTriangle, title: 'No Audit Trail',            desc: 'Opaque decision-making processes vulnerable to administrative and legal scrutiny.' },
  { icon: Gavel,         title: 'Legal Risk',                desc: 'High volume of High Court disputes due to procedural errors in manual parsing.' },
]

// --- Solution cards ---
const SOLUTIONS = [
  { icon: ShieldCheck, title: 'Three-Verdict Engine',    desc: 'Auto-verdicts for Eligible, Ineligible, or Manual Review based on deep document intelligence.' },
  { icon: Globe,       title: 'Kannada-First NLP',        desc: 'Native processing of Kannada-language certificates and local bid documentation.' },
  { icon: FileText,    title: 'KTPP-Compliant Reports',   desc: 'One-click generation of legally defensible evaluation reports for state auditors.' },
  { icon: Lock,        title: 'Immutable Audit Log',      desc: 'Cryptographically secured record of every AI decision for absolute accountability.' },
]

const PIPELINE = ['Upload Bids', 'Extract Criteria', 'Parse Documents', 'AI Matching', 'KTPP Report']

export default function LandingPage() {
  const navigate = useNavigate()

  // navbar shadow on scroll
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // section fade refs
  const problemFade  = useFadeIn()
  const solutionFade = useFadeIn()
  const pipelineFade = useFadeIn()

  // CTA arrow hover
  const [ctaHover, setCtaHover] = useState(false)
  const [cta2Hover, setCta2Hover] = useState(false)

  return (
    <div className="min-h-screen bg-white font-['Inter']">

      {/* ── NAVBAR ── */}
      <nav
        className={`sticky top-0 z-50 bg-[#1A2E4A] text-white px-6 py-3 flex justify-between items-center transition-shadow duration-300 ${
          scrolled ? 'shadow-lg shadow-black/30' : ''
        }`}
      >
        <div className="flex items-center gap-2 select-none">
          <Scale className="w-6 h-6 text-white" />
          <span className="text-xl font-black tracking-tighter">NEETHI AI</span>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white text-[#021934] px-4 py-2 font-bold text-xs uppercase tracking-tight hover:bg-slate-100 active:scale-95 transition-all duration-150 rounded"
        >
          Open Demo →
        </button>
      </nav>

      {/* ── HERO ── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#021934] via-[#1A2E4A] to-[#051c37] text-white pt-28 pb-24 px-6">
        {/* dot grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">CRPF Hackathon 2024 — Theme 3</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tighter mb-5">
            AI-Powered Tender Evaluation<br />for Karnataka Government
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Seamlessly processing Kannada and English bids with full KTPP Act 2000 compliance.
          </p>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
              className="bg-white text-[#021934] px-10 py-4 font-bold text-lg hover:bg-slate-100 active:scale-95 transition-all duration-150 flex items-center gap-3 shadow-xl rounded"
            >
              Open Officer Dashboard
              <ArrowRight
                className={`w-5 h-5 transition-transform duration-200 ${ctaHover ? 'translate-x-1' : ''}`}
              />
            </button>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
              Live demo — pre-loaded with Karnataka tender sample data
            </p>
          </div>
        </div>
      </header>

      {/* ── STATS BAR ── */}
      <StatBar />

      {/* ── PROBLEM ── */}
      <section className="py-16 bg-white">
        <div
          ref={problemFade.ref}
          className={`max-w-5xl mx-auto px-6 transition-all duration-700 ${
            problemFade.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col items-center mb-10">
            <div className="w-12 h-1 bg-red-600 mb-4" />
            <h2 className="text-3xl font-bold uppercase tracking-tight text-[#1b1b1e]">The Procurement Crisis</h2>
          </div>
          <div className="grid md:grid-cols-2 border border-slate-200">
            {PROBLEMS.map((p, i) => {
              const borderRight  = i % 2 === 0 ? 'md:border-r' : ''
              const borderBottom = i < 2 ? 'border-b' : ''
              return (
                <div
                  key={p.title}
                  className={`p-6 flex gap-4 group hover:bg-slate-50 transition-colors duration-200 cursor-default ${borderRight} ${borderBottom} border-slate-200`}
                >
                  <div className="w-11 h-11 bg-slate-100 flex items-center justify-center text-[#021934] shrink-0 group-hover:bg-red-50 group-hover:text-red-600 transition-colors duration-200">
                    <p.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#021934] mb-1 text-base">{p.title}</h3>
                    <p className="text-sm text-[#44474d]">{p.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div
          ref={solutionFade.ref}
          className={`max-w-5xl mx-auto px-6 transition-all duration-700 ${
            solutionFade.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col items-center mb-10">
            <div className="w-12 h-1 bg-[#1A2E4A] mb-4" />
            <h2 className="text-3xl font-bold uppercase tracking-tight text-[#1b1b1e]">How NEETHI AI Solves It</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SOLUTIONS.map((s) => (
              <div
                key={s.title}
                className="bg-white border border-slate-200 p-5 flex flex-col hover:border-[#1A2E4A] hover:shadow-md transition-all duration-200 cursor-default group"
              >
                <s.icon className="w-6 h-6 text-[#021934] mb-4 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="font-bold text-[#021934] text-xs uppercase tracking-wide mb-2">{s.title}</h3>
                <p className="text-xs text-[#44474d] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PIPELINE ── */}
      <section className="bg-[#1A2E4A] py-12">
        <div
          ref={pipelineFade.ref}
          className={`max-w-5xl mx-auto px-6 overflow-x-auto transition-all duration-700 ${
            pipelineFade.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-between min-w-[700px] gap-2">
            {PIPELINE.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-2 group cursor-default">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-200 group-hover:scale-110 group-hover:bg-white/40 ${
                      i === PIPELINE.length - 1 ? 'bg-white/40 border border-white' : 'bg-white/20'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest text-center">{step}</span>
                </div>
                {i < PIPELINE.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-white/30 shrink-0 -mt-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold text-[#021934] mb-3 tracking-tight">See It In Action</h2>
        <p className="text-[#44474d] mb-8 max-w-lg mx-auto text-sm">
          Explore a live evaluation of the NH-75 Bypass tender — 14 bids, Kannada + English documents,
          real verdict logic, and a full KTPP-compliant report.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            onMouseEnter={() => setCta2Hover(true)}
            onMouseLeave={() => setCta2Hover(false)}
            className="bg-[#1A2E4A] text-white px-8 py-3.5 font-bold hover:bg-[#021934] active:scale-95 transition-all duration-150 flex items-center gap-2 rounded"
          >
            Open Officer Dashboard
            <ArrowRight className={`w-4 h-4 transition-transform duration-200 ${cta2Hover ? 'translate-x-1' : ''}`} />
          </button>
        </div>
        <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
          {['Zero silent disqualifications', 'KTPP Sections 13 & 14 compliant', 'Immutable audit trail'].map(f => (
            <div key={f} className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
              {f}
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-100 border-t border-slate-200 py-8 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-[#021934]" />
            <div>
              <span className="block font-black text-[#021934] tracking-tighter">NEETHI AI</span>
              <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold">Karnataka GovTech · CRPF Hackathon 2024</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 text-center md:text-right">
            Neural Evaluation Engine for Transparent &amp; Honest Inquiry
          </p>
        </div>
      </footer>
    </div>
  )
}
