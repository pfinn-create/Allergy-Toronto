import { cn } from '@/lib/utils'
import { ALLERGY_LABELS, ALLERGY_COLORS } from '@/lib/constants'
import type { AllergyType } from '@/types'

interface AllergyBadgeProps {
  allergy: AllergyType
  className?: string
}

export function AllergyBadge({ allergy, className }: AllergyBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        ALLERGY_COLORS[allergy] ?? 'bg-gray-100 text-gray-700',
        className
      )}
    >
      {ALLERGY_LABELS[allergy] ?? allergy}
    </span>
  )
}
