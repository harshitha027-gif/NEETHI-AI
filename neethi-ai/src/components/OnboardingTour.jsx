import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { useI18n } from '../context/I18nContext'

/**
 * OnboardingTour
 * - props.steps: [{ selector?: string, titleKey: string, bodyKey: string, placement?: 'top'|'bottom'|'left'|'right'|'center' }]
 * - props.storageKey: string — localStorage flag; tour skipped if truthy
 * - props.autoStart: boolean — show on mount if not yet seen
 */
export default function OnboardingTour({ steps, storageKey, autoStart = true }) {
  const { t } = useI18n()
  const [active, setActive] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)
  const [targetRect, setTargetRect] = useState(null)
  const bubbleRef = useRef(null)

  useEffect(() => {
    if (!autoStart) return
    try {
      const seen = window.localStorage.getItem(storageKey)
      if (!seen) {
        const t = setTimeout(() => setActive(true), 400)
        return () => clearTimeout(t)
      }
    } catch (e) {
      // localStorage unavailable, just don't auto-start
    }
  }, [autoStart, storageKey])

  useEffect(() => {
    const onRestart = (e) => {
      if (!e?.detail?.key || e.detail.key === storageKey) {
        setStepIdx(0)
        setActive(true)
      }
    }
    window.addEventListener('neethi:start-tour', onRestart)
    return () => window.removeEventListener('neethi:start-tour', onRestart)
  }, [storageKey])

  const step = active ? steps[stepIdx] : null
  const placement = step?.placement || 'bottom'

  useLayoutEffect(() => {
    if (!active || !step) return
    if (!step.selector) {
      setTargetRect(null)
      return
    }
    const el = document.querySelector(step.selector)
    if (!el) {
      setTargetRect(null)
      return
    }
    const update = () => {
      const r = el.getBoundingClientRect()
      setTargetRect({ top: r.top, left: r.left, width: r.width, height: r.height })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [active, step, stepIdx])

  if (!active || !step) return null

  const finish = () => {
    try { window.localStorage.setItem(storageKey, '1') } catch (e) { /* ignore */ }
    setActive(false)
    setStepIdx(0)
  }

  const next = () => {
    if (stepIdx < steps.length - 1) setStepIdx(stepIdx + 1)
    else finish()
  }
  const back = () => stepIdx > 0 && setStepIdx(stepIdx - 1)

  const isCenter = !targetRect || placement === 'center'
  const PAD = 8
  const BUBBLE_W = 320

  let bubbleStyle = {}
  let arrowStyle = null
  if (isCenter) {
    bubbleStyle = {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  } else {
    const r = targetRect
    if (placement === 'bottom') {
      bubbleStyle = { top: r.top + r.height + PAD + 6, left: Math.max(8, r.left + r.width / 2 - BUBBLE_W / 2) }
      arrowStyle = { top: -6, left: BUBBLE_W / 2 - 6 }
    } else if (placement === 'top') {
      bubbleStyle = { top: r.top - PAD - 6, left: Math.max(8, r.left + r.width / 2 - BUBBLE_W / 2), transform: 'translateY(-100%)' }
      arrowStyle = { bottom: -6, left: BUBBLE_W / 2 - 6 }
    } else if (placement === 'right') {
      bubbleStyle = { top: r.top + r.height / 2, left: r.left + r.width + PAD + 6, transform: 'translateY(-50%)' }
      arrowStyle = { left: -6, top: '50%', marginTop: -6 }
    } else if (placement === 'left') {
      bubbleStyle = { top: r.top + r.height / 2, left: r.left - PAD - 6, transform: 'translate(-100%, -50%)' }
      arrowStyle = { right: -6, top: '50%', marginTop: -6 }
    }
  }

  const last = stepIdx === steps.length - 1

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none" aria-live="polite">
      {/* Dimmer */}
      <div className="absolute inset-0 bg-black/55 pointer-events-auto" onClick={finish} />

      {/* Spotlight ring around target */}
      {!isCenter && targetRect && (
        <div
          className="absolute rounded-lg ring-4 ring-white/70 ring-offset-2 ring-offset-transparent transition-all duration-200 pointer-events-none"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
          }}
        />
      )}

      {/* Bubble */}
      <div
        ref={bubbleRef}
        style={{ ...bubbleStyle, width: BUBBLE_W }}
        className="absolute bg-white rounded-lg shadow-2xl border border-slate-200 p-5 pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-label={t(step.titleKey)}
      >
        {arrowStyle && (
          <div
            className="absolute w-3 h-3 bg-white border-l border-t border-slate-200 rotate-45"
            style={arrowStyle}
            aria-hidden
          />
        )}

        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm leading-tight">{t(step.titleKey)}</h3>
          </div>
          <button
            onClick={finish}
            className="text-slate-400 hover:text-slate-700 p-0.5 rounded shrink-0"
            aria-label="Close tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-4">{t(step.bodyKey)}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === stepIdx ? 'bg-blue-600 w-4' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {stepIdx > 0 && (
              <button
                onClick={back}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                {t('tour.back')}
              </button>
            )}
            {stepIdx === 0 && (
              <button
                onClick={finish}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded"
              >
                {t('tour.skip')}
              </button>
            )}
            <button
              onClick={next}
              className="px-3 py-1.5 bg-[#1A2E4A] text-white text-xs font-bold rounded hover:bg-[#021934] flex items-center gap-1 shadow-sm"
            >
              {last ? t('tour.done') : t('tour.next')}
              {!last && <ArrowRight className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
