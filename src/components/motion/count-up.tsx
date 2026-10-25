import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const DURATION_MS = 900
const easeOutQuint = (t: number) => 1 - (1 - t) ** 5

/**
 * Counts the leading number in `value` ("40×", "12M", "3 months") up from zero
 * the first time it scrolls into view. Screen readers get the final value only.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/)
  const hasNumber = match !== null
  const target = match ? Number(match[1]) : 0
  const suffix = match ? match[2] : value
  const ref = useRef<HTMLSpanElement>(null)
  // Any visibility counts: a margin here left numbers near the top of the screen stuck at 0.
  const inView = useInView(ref, { once: true })
  const reduceMotion = useReducedMotion()
  const [current, setCurrent] = useState(0)
  const shown = reduceMotion ? target : current

  useEffect(() => {
    if (!hasNumber || reduceMotion || !inView) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION_MS)
      setCurrent(Math.round(target * easeOutQuint(progress)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduceMotion, hasNumber, target])

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" data-count-up className="tabular-nums">
        {hasNumber ? shown : ''}
        {suffix}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  )
}
