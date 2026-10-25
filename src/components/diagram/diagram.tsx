import { m, useReducedMotion, type Variants } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * A tiny SVG kit for blog diagrams. Everything is drawn with theme tokens, so
 * diagrams follow light and dark mode. Coordinates are in viewBox units.
 *
 * The first time a diagram scrolls into view, its edges draw themselves in
 * the direction of flow, one after another (`staggerChildren`), and labels
 * fade in behind them. Nodes stay static. Reduced motion shows the final state.
 */

const svgVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const pathVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.3 } },
}

type DiagramProps = {
  width: number
  height: number
  title: string
  caption?: ReactNode
  children: ReactNode
}

export function Diagram({ width, height, title, caption, children }: DiagramProps) {
  const reduceMotion = useReducedMotion()
  return (
    <figure className="not-prose my-8">
      <div className="overflow-x-auto rounded-xl border bg-card p-4">
        <m.svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={title}
          className="mx-auto h-auto w-full min-w-[560px] text-muted-foreground"
          style={{ maxWidth: width }}
          variants={svgVariants}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
            <marker id="arrow-brand" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="fill-brand" />
            </marker>
          </defs>
          {children}
        </m.svg>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-pretty text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  )
}

type Tone = 'default' | 'brand' | 'muted'

const nodeTone: Record<Tone, string> = {
  default: 'fill-background stroke-border',
  brand: 'fill-brand/10 stroke-brand',
  muted: 'fill-muted stroke-border',
}

type NodeProps = {
  x: number
  y: number
  w: number
  h: number
  label: string
  sub?: string
  tone?: Tone
  mono?: boolean
}

export function Node({ x, y, w, h, label, sub, tone = 'default', mono }: NodeProps) {
  const cx = x + w / 2
  const cy = y + h / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} className={cn('stroke-[1.25]', nodeTone[tone])} />
      <text
        x={cx}
        y={sub ? cy - 4 : cy + 4.5}
        textAnchor="middle"
        className={cn('fill-foreground text-[13px] font-medium', mono && 'font-mono text-[12px]')}
      >
        {label}
      </text>
      {sub && (
        <text x={cx} y={cy + 13} textAnchor="middle" className="fill-muted-foreground font-mono text-[10.5px]">
          {sub}
        </text>
      )}
    </g>
  )
}

type GroupProps = { x: number; y: number; w: number; h: number; label: string; tone?: 'default' | 'brand' }

export function Group({ x, y, w, h, label, tone = 'default' }: GroupProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        strokeDasharray="5 4"
        className={cn('fill-none stroke-[1.25]', tone === 'brand' ? 'stroke-brand/60' : 'stroke-border')}
      />
      <text x={x + 12} y={y + 20} className="fill-muted-foreground font-mono text-[11px] tracking-wider uppercase">
        {label}
      </text>
    </g>
  )
}

type EdgeProps = {
  d: string
  label?: string
  labelX?: number
  labelY?: number
  tone?: 'default' | 'brand'
  dashed?: boolean
  arrow?: 'end' | 'both' | 'none'
}

export function Edge({ d, label, labelX, labelY, tone = 'default', dashed, arrow = 'end' }: EdgeProps) {
  const reduceMotion = useReducedMotion()
  // Arrowheads appear once the line has finished drawing, so they never float ahead of it.
  const [drawn, setDrawn] = useState(Boolean(reduceMotion))
  const marker = tone === 'brand' ? 'url(#arrow-brand)' : 'url(#arrow)'
  const showMarkers = drawn || Boolean(reduceMotion)
  return (
    <g>
      <m.path
        d={d}
        fill="none"
        strokeDasharray={dashed ? '4 4' : undefined}
        markerEnd={arrow === 'none' || !showMarkers ? undefined : marker}
        markerStart={arrow === 'both' && showMarkers ? marker : undefined}
        className={cn('stroke-[1.25]', tone === 'brand' ? 'stroke-brand' : 'stroke-muted-foreground/70')}
        // pathLength drives stroke-dasharray, so dashed edges fade in instead of drawing.
        variants={dashed ? fadeVariants : pathVariants}
        onAnimationComplete={() => setDrawn(true)}
      />
      {label && labelX !== undefined && labelY !== undefined && (
        <m.g variants={fadeVariants}>
          <EdgeLabel x={labelX} y={labelY}>
            {label}
          </EdgeLabel>
        </m.g>
      )}
    </g>
  )
}

export function EdgeLabel({ x, y, children }: { x: number; y: number; children: string }) {
  const width = children.length * 6.2 + 12
  return (
    <g>
      <rect x={x - width / 2} y={y - 10} width={width} height={18} rx={4} className="fill-card" />
      <text x={x} y={y + 3} textAnchor="middle" className="fill-muted-foreground font-mono text-[10.5px]">
        {children}
      </text>
    </g>
  )
}
