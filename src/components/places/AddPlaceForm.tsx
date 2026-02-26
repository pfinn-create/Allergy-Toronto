'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { NEIGHBORHOODS, ALLERGY_TYPES, ALLERGY_LABELS, CUISINE_TYPES } from '@/lib/constants'
import type { AllergyType } from '@/types'
import { CheckCircle } from 'lucide-react'

interface AddPlaceFormProps {
  userId: string
}

export function AddPlaceForm({ userId }: AddPlaceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [selectedAllergies, setSelectedAllergies] = useState<AllergyType[]>([])

  const [form, setForm] = useState({
    name: '',
    address: '',
    neighborhood: '',
    cuisine_type: '',
    description: '',
    phone: '',
    website: '',
  })

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function toggleAllergy(allergy: AllergyType) {
    setSelectedAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name || !form.address || !form.neighborhood || !form.cuisine_type) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { data: place, error: placeError } = await supabase
      .from('places')
      .insert({
        ...form,
        created_by: userId,
        approved: false,
        website: form.website || null,
        phone: form.phone || null,
        description: form.description || null,
      })
      .select()
      .single()

    if (placeError) {
      setError(placeError.message)
      setLoading(false)
      return
    }

    if (selectedAllergies.length > 0) {
      await supabase.from('place_allergies').insert(
        selectedAllergies.map((allergy) => ({ place_id: place.id, allergy_type: allergy }))
      )
    }

    setLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <CheckCircle className="w-12 h-12 text-teal-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Place submitted!</h2>
        <p className="text-gray-500 text-sm mb-6">
          Thanks for contributing. Your place will appear on the site after a quick review.
        </p>
        <Button onClick={() => router.push('/')}>Back to places</Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="name"
          label="Place name *"
          value={form.name}
          onChange={set('name')}
          placeholder="e.g. The Green Bowl"
          required
        />

        <Input
          id="address"
          label="Address *"
          value={form.address}
          onChange={set('address')}
          placeholder="123 Queen St W, Toronto"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            id="neighborhood"
            label="Neighbourhood *"
            value={form.neighborhood}
            onChange={set('neighborhood')}
            required
          >
            <option value="">Select…</option>
            {NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </Select>

          <Select
            id="cuisine_type"
            label="Cuisine type *"
            value={form.cuisine_type}
            onChange={set('cuisine_type')}
            required
          >
            <option value="">Select…</option>
            {CUISINE_TYPES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>

        <Textarea
          id="description"
          label="Description"
          value={form.description}
          onChange={set('description')}
          placeholder="Describe the place, its allergy-friendly approach, what makes it stand out…"
          rows={3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="phone"
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            placeholder="+1 (416) 555-0100"
          />
          <Input
            id="website"
            label="Website"
            type="url"
            value={form.website}
            onChange={set('website')}
            placeholder="https://example.com"
          />
        </div>

        {/* Allergy accommodations */}
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Allergy accommodations offered
          </p>
          <div className="flex flex-wrap gap-2">
            {ALLERGY_TYPES.map((allergy) => (
              <button
                key={allergy}
                type="button"
                onClick={() => toggleAllergy(allergy)}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
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

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full" size="lg">
          {loading ? 'Submitting…' : 'Submit place'}
        </Button>
      </form>
    </div>
  )
}
