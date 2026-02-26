'use client'

import Link from 'next/link'
import { RatingForm } from './RatingForm'
import type { User } from '@supabase/supabase-js'
import type { Rating } from '@/types'

interface RatingFormSectionProps {
  placeId: string
  user: User | null
  existingRating?: Rating
}

export function RatingFormSection({ placeId, user, existingRating }: RatingFormSectionProps) {
  if (!user) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-600 mb-4">
          Sign in to rate this place and help others with allergies.
        </p>
        <div className="space-y-2">
          <Link
            href="/auth/login"
            className="block w-full text-center py-2 px-4 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="block w-full text-center py-2 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>
    )
  }

  return (
    <RatingForm
      placeId={placeId}
      existingRating={existingRating}
    />
  )
}
