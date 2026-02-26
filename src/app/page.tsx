import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { PlaceCard } from '@/components/places/PlaceCard'
import { SearchBar } from '@/components/places/SearchBar'
import { ShieldCheck, MapPin, Star, Users } from 'lucide-react'
import type { Place, AllergyType } from '@/types'

interface HomeProps {
  searchParams: Promise<{
    q?: string
    neighborhood?: string
    allergy?: string
    minRating?: string
  }>
}

async function PlacesList({ searchParams }: HomeProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('places_with_ratings')
    .select('*')
    .eq('approved', true)
    .order('average_rating', { ascending: false, nullsFirst: false })

  if (params.q) {
    query = query.ilike('name', `%${params.q}%`)
  }
  if (params.neighborhood) {
    query = query.eq('neighborhood', params.neighborhood)
  }
  if (params.allergy) {
    query = query.contains('allergies', [params.allergy])
  }
  if (params.minRating) {
    query = query.gte('average_rating', parseFloat(params.minRating))
  }

  const { data: places, error } = await query

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load places. Please try again.
      </div>
    )
  }

  if (!places || places.length === 0) {
    return (
      <div className="text-center py-16">
        <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">No places found</h3>
        <p className="text-gray-400 text-sm">Try adjusting your filters or be the first to add a place!</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        {places.length} {places.length === 1 ? 'place' : 'places'} found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            place={{
              ...place,
              allergies: (place.allergies ?? []) as AllergyType[],
              average_rating: place.average_rating ?? undefined,
              rating_count: place.rating_count ? Number(place.rating_count) : undefined,
            } as Place}
          />
        ))}
      </div>
    </div>
  )
}

export default async function HomePage(props: HomeProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <MapPin className="w-4 h-4" />
          Toronto, Ontario
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Find allergy-friendly places<br />
          <span className="text-teal-600">you can actually trust</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Real reviews from real people with allergies. Find restaurants, cafes, and
          food spots that take your allergies seriously.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto text-center">
        {[
          { icon: MapPin, label: 'Places', value: '100+' },
          { icon: Star, label: 'Reviews', value: '500+' },
          { icon: Users, label: 'Community', value: 'Growing' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-3">
            <Icon className="w-5 h-5 text-teal-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-8">
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>

      {/* Results */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        }
      >
        <PlacesList searchParams={props.searchParams} />
      </Suspense>
    </div>
  )
}
