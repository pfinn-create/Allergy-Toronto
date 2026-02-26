'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
}

const sizes = {
  sm: 'w-3 h-3',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  return (
    <div className={cn('flex gap-0.5', className)}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const partial = !filled && i < rating
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={cn(
              'relative transition-transform',
              interactive && 'cursor-pointer hover:scale-110',
              !interactive && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizes[size],
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : partial
                  ? 'fill-amber-200 text-amber-400'
                  : 'fill-gray-100 text-gray-300'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
