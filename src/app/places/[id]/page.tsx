import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StarRating } from '@/components/ui/StarRating'
import { AllergyBadge } from '@/components/ui/AllergyBadge'
import { RatingCard } from '@/components/ratings/RatingCard'
import { RatingFormSection } from '@/components/ratings/RatingFormSection'
import { getRatingColor, getRatingLabel, formatDate } from '@/lib/utils'
import { RATING_LABELS } from '@/lib/constants'
import { MapPin, Phone, Globe, ArrowLeft, UtensilsCrossed } from 'lucide-react'
import type { AllergyType, Rating } from '@/types'

interface PlacePageProps {
  params: Promise<{ id: string }>
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: place }, { data: rawRatings }, { data: { user } }] = await Promise.all([
    supabase.from('places_with_ratings').select('*').eq('id', id).single(),
    supabase.from('ratings').select('*, profiles(display_name)').eq('place_id', id).order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  if (!place) notFound()

  const ratings: Rating[] = (rawRatings ?? []).map((r) => ({
    ...r,
    allergies_mentioned: (r.allergies_mentioned ?? []) as AllergyType[],
  }))

  const userRating = user ? ratings.find((r) => r.user_id === user.id) : null

  const avgBreakdown = ratings.length > 0
    ? {
        staff_knowledge: ratings.reduce((s, r) => s + r.staff_knowledge_score, 0) / ratings.length,
        menu_options: ratings.reduce((s, r) => s + r.menu_options_score, 0) / ratings.length,
        cross_contamination: ratings.reduce((s, r) => s + r.cross_contamination_score, 0) / ratings.length,
      }
    : null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to places
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column — place info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{place.name}</h1>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <UtensilsCrossed className="w-4 h-4" />
                  {place.cuisine_type}
                </div>
              </div>

              {place.average_rating ? (
                <div className="text-center bg-teal-50 border border-teal-200 rounded-xl px-4 py-2 flex-shrink-0">
                  <div className={`text-3xl font-bold ${getRatingColor(place.average_rating)}`}>
                    {Number(place.average_rating).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">{getRatingLabel(place.average_rating)}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {place.rating_count} {Number(place.rating_count) === 1 ? 'review' : 'reviews'}
                  </div>
                </div>
              ) : (
                <div className="text-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 flex-shrink-0">
                  <div className="text-sm text-gray-400">No ratings yet</div>
                </div>
              )}
            </div>

            {place.description && (
              <p className="text-gray-700 text-sm leading-relaxed mb-4">{place.description}</p>
            )}

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>{place.address} · {place.neighborhood}</span>
              </div>
              {place.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${place.phone}`} className="hover:text-teal-600">{place.phone}</a>
                </div>
              )}
              {place.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-teal-600 truncate"
                  >
                    {place.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Allergy accommodations */}
          {place.allergies && place.allergies.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Allergy Accommodations</h2>
              <div className="flex flex-wrap gap-2">
                {(place.allergies as AllergyType[]).map((a) => (
                  <AllergyBadge key={a} allergy={a} />
                ))}
              </div>
            </div>
          )}

          {/* Rating breakdown */}
          {avgBreakdown && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h2>
              <div className="space-y-3">
                {[
                  { label: RATING_LABELS.staff_knowledge_score, value: avgBreakdown.staff_knowledge },
                  { label: RATING_LABELS.menu_options_score, value: avgBreakdown.menu_options },
                  { label: RATING_LABELS.cross_contamination_score, value: avgBreakdown.cross_contamination },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-48 flex-shrink-0">{label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-teal-500 h-2 rounded-full transition-all"
                        style={{ width: `${(value / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {value.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-4">
              Reviews ({ratings.length})
            </h2>
            {ratings.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <RatingCard key={rating.id} rating={rating} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column — submit rating */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4">
              {userRating ? 'Update your review' : 'Rate this place'}
            </h2>
            <RatingFormSection
              placeId={place.id}
              user={user}
              existingRating={userRating ?? undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
