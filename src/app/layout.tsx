import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'AllergyTO — Find allergy-friendly places in Toronto',
  description:
    'Discover and rate restaurants, cafes, and food spots in Toronto that are safe for people with food allergies.',
  keywords: ['allergy friendly', 'toronto', 'restaurants', 'gluten free', 'nut free', 'dairy free'],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900 font-sans">
        <Navbar user={user} />
        <main>{children}</main>
      </body>
    </html>
  )
}
