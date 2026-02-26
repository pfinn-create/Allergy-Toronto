import Link from 'next/link'
import { MapPin, Star, MessageSquare, UtensilsCrossed } from 'lucide-react'
import { AllergyBadge } from '@/components/ui/AllergyBadge'
import { getRatingColor, getRatingLabel, cn } from '@/lib/utils'
import type { Place, AllergyType } from '@/types'

interface PlaceCardProps {
  place: Place
}

export function PlaceCard({ place }: PlaceCardProps) {
  const rating = place.average_rating ?? 0
  const hasRating = (place.rating_count ?? 0) > 0

  return (
    <Link
      href={`/places/${place.id}`}
      className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-200"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base group-hover:text-teal-700 transition-colors truncate">
              {place.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-gray-500 text-xs">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{place.neighborhood}</span>
            </div>
          </div>

          <div className={cn(
            'flex-shrink-0 flex flex-col items-center px-3 py-1.5 rounded-xl border',
            hasRating ? getRatingBadgeStyle(rating) : 'bg-gray-50 border-gray-200'
          )}>
            {hasRating ? (
              <>
                <span className={cn('text-lg font-bold leading-none', getRatingColor(rating))}>
                  {rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500 mt-0.5">{getRatingLabel(rating)}</span>
              </>
            ) : (
              <span className="text-xs text-gray-400">No ratings</span>
            )}
          </div>
        </div>

        {place.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{place.description}</p>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>{place.cuisine_type}</span>
          {hasRating && (
            <>
              <span className="text-gray-300">·</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{place.rating_count} {place.rating_count === 1 ? 'review' : 'reviews'}</span>
            </>
          )}
        </div>

        {place.allergies && place.allergies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {place.allergies.slice(0, 4).map((allergy) => (
              <AllergyBadge key={allergy} allergy={allergy as AllergyType} />
            ))}
            {place.allergies.length > 4 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">
                +{place.allergies.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

function getRatingBadgeStyle(rating: number): string {
  if (rating >= 4.5) return 'bg-emerald-50 border-emerald-200'
  if (rating >= 4.0) return 'bg-green-50 border-green-200'
  if (rating >= 3.0) return 'bg-yellow-50 border-yellow-200'
  if (rating >= 2.0) return 'bg-orange-50 border-orange-200'
  return 'bg-red-50 border-red-200'
}
