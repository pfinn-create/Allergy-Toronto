import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StarRating } from '@/components/ui/StarRating'
import { formatDate } from '@/lib/utils'
import { MapPin, Star, Calendar } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: ratings } = await supabase
    .from('ratings')
    .select('*, places(name, neighborhood)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: submissions } = await supabase
    .from('places')
    .select('id, name, neighborhood, approved, created_at')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-xl font-bold text-teal-700">
            {user.email?.[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.email}</h1>
            <p className="text-sm text-gray-500">Member since {formatDate(user.created_at)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <Star className="w-5 h-5 text-teal-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">{ratings?.length ?? 0}</div>
            <div className="text-xs text-gray-500">Reviews written</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <MapPin className="w-5 h-5 text-teal-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">{submissions?.length ?? 0}</div>
            <div className="text-xs text-gray-500">Places submitted</div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {ratings && ratings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your reviews</h2>
          <div className="space-y-3">
            {ratings.map((r) => (
              <Link
                key={r.id}
                href={`/places/${r.place_id}`}
                className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-teal-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{(r.places as { name: string })?.name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {(r.places as { neighborhood: string })?.neighborhood}
                      <span>·</span>
                      <Calendar className="w-3 h-3" />
                      {formatDate(r.created_at)}
                    </div>
                  </div>
                  <StarRating rating={r.overall_score} size="sm" />
                </div>
                {r.review_text && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{r.review_text}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Submissions */}
      {submissions && submissions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your submissions</h2>
          <div className="space-y-3">
            {submissions.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.neighborhood} · {formatDate(s.created_at)}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  s.approved
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {s.approved ? 'Published' : 'Pending review'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
