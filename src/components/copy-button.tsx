import { Check, Copy, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type Status = 'idle' | 'copied' | 'failed'

const feedback = {
  copied: { text: 'Copied', icon: <Check className="size-4 text-brand" /> },
  failed: { text: "Couldn't copy, select the address instead", icon: <X className="size-4 text-destructive" /> },
}

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = setTimeout(() => setStatus('idle'), 2000)
    return () => clearTimeout(timer)
  }, [status])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setStatus('copied')
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission).
      setStatus('failed')
    }
  }

  return (
    <Tooltip open={status !== 'idle' || undefined}>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" onClick={copy} aria-label={label}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={status}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {status === 'idle' ? <Copy className="size-4" /> : feedback[status].icon}
            </motion.span>
          </AnimatePresence>
        </Button>
      </TooltipTrigger>
      <TooltipContent role="status">{status === 'idle' ? label : feedback[status].text}</TooltipContent>
    </Tooltip>
  )
}
