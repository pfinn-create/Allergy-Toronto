'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { StarRating } from '@/components/ui/StarRating'
import { AllergyBadge } from '@/components/ui/AllergyBadge'
import { RATING_LABELS, ALLERGY_TYPES, ALLERGY_LABELS } from '@/lib/constants'
import type { AllergyType } from '@/types'

interface RatingFormProps {
  placeId: string
  existingRating?: {
    overall_score: number
    staff_knowledge_score: number
    menu_options_score: number
    cross_contamination_score: number
    review_text?: string
    allergies_mentioned?: AllergyType[]
  }
  onSuccess?: () => void
}

type ScoreField = 'overall_score' | 'staff_knowledge_score' | 'menu_options_score' | 'cross_contamination_score'

export function RatingForm({ placeId, existingRating, onSuccess }: RatingFormProps) {
  const router = useRouter()
  const [scores, setScores] = useState({
    overall_score: existingRating?.overall_score ?? 0,
    staff_knowledge_score: existingRating?.staff_knowledge_score ?? 0,
    menu_options_score: existingRating?.menu_options_score ?? 0,
    cross_contamination_score: existingRating?.cross_contamination_score ?? 0,
  })
  const [reviewText, setReviewText] = useState(existingRating?.review_text ?? '')
  const [selectedAllergies, setSelectedAllergies] = useState<AllergyType[]>(
    existingRating?.allergies_mentioned ?? []
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function toggleAllergy(allergy: AllergyType) {
    setSelectedAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (Object.values(scores).some((s) => s === 0)) {
      setError('Please provide all four ratings before submitting.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    const payload = {
      place_id: placeId,
      user_id: user.id,
      ...scores,
      review_text: reviewText || null,
      allergies_mentioned: selectedAllergies,
    }

    const { error: dbError } = existingRating
      ? await supabase.from('ratings').update(payload).eq('place_id', placeId).eq('user_id', user.id)
      : await supabase.from('ratings').insert(payload)

    setLoading(false)

    if (dbError) {
      setError(dbError.message)
    } else {
      onSuccess?.()
      router.refresh()
    }
  }

  const scoreFields: ScoreField[] = [
    'overall_score',
    'staff_knowledge_score',
    'menu_options_score',
    'cross_contamination_score',
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Score fields */}
      <div className="space-y-4">
        {scoreFields.map((field) => (
          <div key={field} className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {RATING_LABELS[field]}
            </label>
            <StarRating
              rating={scores[field]}
              interactive
              size="lg"
              onChange={(val) => setScores((prev) => ({ ...prev, [field]: val }))}
            />
          </div>
        ))}
      </div>

      {/* Allergies mentioned */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Which allergies did you mention? <span className="text-gray-400 font-normal">(optional)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {ALLERGY_TYPES.map((allergy) => (
            <button
              key={allergy}
              type="button"
              onClick={() => toggleAllergy(allergy)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                selectedAllergies.includes(allergy)
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'
              }`}
            >
              {ALLERGY_LABELS[allergy]}
            </button>
          ))}
        </div>
      </div>

      {/* Review text */}
      <Textarea
        id="review"
        label="Your experience (optional)"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Describe how the staff handled your allergy request, what you ordered, any concerns…"
        rows={4}
      />

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? 'Submitting…' : existingRating ? 'Update review' : 'Submit review'}
      </Button>
    </form>
  )
}
