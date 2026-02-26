import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AddPlaceForm } from '@/components/places/AddPlaceForm'

export default async function AddPlacePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Add a new place</h1>
        <p className="text-gray-500 text-sm">
          Help the community by adding an allergy-friendly place in Toronto.
          Your submission will be reviewed before appearing publicly.
        </p>
      </div>
      <AddPlaceForm userId={user.id} />
    </div>
  )
}
