import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-emerald-600'
  if (rating >= 4.0) return 'text-green-600'
  if (rating >= 3.0) return 'text-yellow-600'
  if (rating >= 2.0) return 'text-orange-600'
  return 'text-red-600'
}

export function getRatingBg(rating: number): string {
  if (rating >= 4.5) return 'bg-emerald-50 border-emerald-200'
  if (rating >= 4.0) return 'bg-green-50 border-green-200'
  if (rating >= 3.0) return 'bg-yellow-50 border-yellow-200'
  if (rating >= 2.0) return 'bg-orange-50 border-orange-200'
  return 'bg-red-50 border-red-200'
}

export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return 'Excellent'
  if (rating >= 4.0) return 'Great'
  if (rating >= 3.0) return 'Good'
  if (rating >= 2.0) return 'Fair'
  return 'Poor'
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
