'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { NEIGHBORHOODS, ALLERGY_TYPES, ALLERGY_LABELS } from '@/lib/constants'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [neighborhood, setNeighborhood] = useState(searchParams.get('neighborhood') ?? '')
  const [allergy, setAllergy] = useState(searchParams.get('allergy') ?? '')
  const [minRating, setMinRating] = useState(searchParams.get('minRating') ?? '')
  const [showFilters, setShowFilters] = useState(
    !!(searchParams.get('neighborhood') || searchParams.get('allergy') || searchParams.get('minRating'))
  )

  function applyFilters(overrides: Record<string, string> = {}) {
    const params = new URLSearchParams()
    const q = overrides.query ?? query
    const n = overrides.neighborhood ?? neighborhood
    const a = overrides.allergy ?? allergy
    const r = overrides.minRating ?? minRating

    if (q) params.set('q', q)
    if (n) params.set('neighborhood', n)
    if (a) params.set('allergy', a)
    if (r) params.set('minRating', r)

    startTransition(() => {
      router.push(`/?${params.toString()}`)
    })
  }

  function clearAll() {
    setQuery('')
    setNeighborhood('')
    setAllergy('')
    setMinRating('')
    startTransition(() => router.push('/'))
  }

  const hasFilters = query || neighborhood || allergy || minRating

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder="Search restaurants, cafes…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <Button onClick={() => applyFilters()} disabled={isPending} size="md">
          Search
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {hasFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-teal-500 rounded-full" />
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <Select
            id="neighborhood"
            value={neighborhood}
            onChange={(e) => {
              setNeighborhood(e.target.value)
              applyFilters({ neighborhood: e.target.value })
            }}
          >
            <option value="">All neighbourhoods</option>
            {NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </Select>

          <Select
            id="allergy"
            value={allergy}
            onChange={(e) => {
              setAllergy(e.target.value)
              applyFilters({ allergy: e.target.value })
            }}
          >
            <option value="">All allergies</option>
            {ALLERGY_TYPES.map((a) => (
              <option key={a} value={a}>{ALLERGY_LABELS[a]}</option>
            ))}
          </Select>

          <Select
            id="minRating"
            value={minRating}
            onChange={(e) => {
              setMinRating(e.target.value)
              applyFilters({ minRating: e.target.value })
            }}
          >
            <option value="">Any rating</option>
            <option value="4.5">4.5+ Excellent</option>
            <option value="4">4.0+ Great</option>
            <option value="3">3.0+ Good</option>
          </Select>
        </div>
      )}

      {hasFilters && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Filters active</span>
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-800 font-medium"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
