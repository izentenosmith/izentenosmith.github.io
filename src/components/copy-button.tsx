import { Check, Copy, X } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type Status = 'idle' | 'copied' | 'failed'

type CopyButtonProps = {
  /** The text to copy, or a function that reads it at click time. */
  value: string | (() => string)
  label: string
  failedText?: string
  className?: string
}

export function CopyButton({
  value,
  label,
  failedText = "Couldn't copy, select the text instead",
  className = 'size-11 sm:size-9',
}: CopyButtonProps) {
  const feedback = {
    copied: { text: 'Copied', icon: <Check className="size-4 text-signal" /> },
    failed: { text: failedText, icon: <X className="size-4 text-destructive" /> },
  }
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = setTimeout(() => setStatus('idle'), 2000)
    return () => clearTimeout(timer)
  }, [status])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(typeof value === 'function' ? value() : value)
      setStatus('copied')
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission).
      setStatus('failed')
    }
  }

  return (
    <Tooltip open={status !== 'idle' || undefined}>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" className={className} onClick={copy} aria-label={label}>
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={status}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {status === 'idle' ? <Copy className="size-4" /> : feedback[status].icon}
            </m.span>
          </AnimatePresence>
        </Button>
      </TooltipTrigger>
      <TooltipContent role="status">{status === 'idle' ? label : feedback[status].text}</TooltipContent>
    </Tooltip>
  )
}
