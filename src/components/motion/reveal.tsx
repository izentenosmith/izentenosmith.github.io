import { m, type HTMLMotionProps } from 'motion/react'

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number
}

/**
 * Fades and lifts its content in the first time it scrolls into view. Used for
 * section headings only; cards and list items stay static (one or two moving
 * things per view). Timing matches --dur-reveal and --ease-enter in index.css.
 */
export function Reveal({ delay = 0, ...props }: RevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    />
  )
}
