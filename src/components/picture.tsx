import type { Picture as PictureData } from '@/assets/images'
import { cn } from '@/lib/utils'

type PictureProps = {
  picture: PictureData
  alt: string
  sizes: string
  className?: string
  /** Above-the-fold images load immediately and at high priority. */
  priority?: boolean
}

export function Picture({ picture, alt, sizes, className, priority = false }: PictureProps) {
  const { sources, img } = picture
  return (
    <picture>
      {Object.entries(sources).map(([format, srcset]) => (
        <source key={format} type={`image/${format}`} srcSet={srcset} sizes={sizes} />
      ))}
      <img
        src={img.src}
        width={img.w}
        height={img.h}
        alt={alt}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={cn('h-auto w-full object-cover', className)}
      />
    </picture>
  )
}
