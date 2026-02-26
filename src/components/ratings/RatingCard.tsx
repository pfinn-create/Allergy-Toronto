import { StarRating } from '@/components/ui/StarRating'
import { AllergyBadge } from '@/components/ui/AllergyBadge'
import { formatDate } from '@/lib/utils'
import { RATING_LABELS } from '@/lib/constants'
import type { Rating, AllergyType } from '@/types'
import { User } from 'lucide-react'

interface RatingCardProps {
  rating: Rating
}

export function RatingCard({ rating }: RatingCardProps) {
  const subScores = [
    { label: RATING_LABELS.staff_knowledge_score, value: rating.staff_knowledge_score },
    { label: RATING_LABELS.menu_options_score, value: rating.menu_options_score },
    { label: RATING_LABELS.cross_contamination_score, value: rating.cross_contamination_score },
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
            <User className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {rating.user_email ? rating.user_email.split('@')[0] : 'Anonymous'}
            </p>
            <p className="text-xs text-gray-400">{formatDate(rating.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StarRating rating={rating.overall_score} size="sm" />
          <span className="text-sm font-bold text-gray-900">{rating.overall_score}.0</span>
        </div>
      </div>

      {/* Review text */}
      {rating.review_text && (
        <p className="text-sm text-gray-700 leading-relaxed">{rating.review_text}</p>
      )}

      {/* Sub-scores */}
      <div className="grid grid-cols-3 gap-3">
        {subScores.map(({ label, value }) => (
          <div key={label} className="text-center bg-gray-50 rounded-xl p-2">
            <div className="text-xs text-gray-500 mb-1 leading-tight">{label}</div>
            <StarRating rating={value} size="sm" className="justify-center" />
          </div>
        ))}
      </div>

      {/* Allergies mentioned */}
      {rating.allergies_mentioned && rating.allergies_mentioned.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {rating.allergies_mentioned.map((a) => (
            <AllergyBadge key={a} allergy={a as AllergyType} />
          ))}
        </div>
      )}
    </div>
  )
}
