import type { AllergyType, Neighborhood } from '@/types'

export const ALLERGY_LABELS: Record<AllergyType, string> = {
  gluten: 'Gluten-Free',
  nuts: 'Tree Nut-Free',
  peanuts: 'Peanut-Free',
  dairy: 'Dairy-Free',
  eggs: 'Egg-Free',
  soy: 'Soy-Free',
  shellfish: 'Shellfish-Free',
  fish: 'Fish-Free',
  sesame: 'Sesame-Free',
  vegan: 'Vegan',
  vegetarian: 'Vegetarian',
}

export const ALLERGY_COLORS: Record<AllergyType, string> = {
  gluten: 'bg-amber-100 text-amber-800',
  nuts: 'bg-orange-100 text-orange-800',
  peanuts: 'bg-red-100 text-red-800',
  dairy: 'bg-blue-100 text-blue-800',
  eggs: 'bg-yellow-100 text-yellow-800',
  soy: 'bg-green-100 text-green-800',
  shellfish: 'bg-cyan-100 text-cyan-800',
  fish: 'bg-teal-100 text-teal-800',
  sesame: 'bg-purple-100 text-purple-800',
  vegan: 'bg-emerald-100 text-emerald-800',
  vegetarian: 'bg-lime-100 text-lime-800',
}

export const NEIGHBORHOODS: Neighborhood[] = [
  'Downtown',
  'Midtown',
  'East End',
  'West End',
  'North York',
  'Scarborough',
  'Etobicoke',
  'Yorkville',
  'Kensington Market',
  'Queen West',
  'Leslieville',
  'The Annex',
  'Little Italy',
  'Chinatown',
  'Distillery District',
  'Liberty Village',
  'Roncesvalles',
  'Danforth',
]

export const ALLERGY_TYPES: AllergyType[] = [
  'gluten',
  'nuts',
  'peanuts',
  'dairy',
  'eggs',
  'soy',
  'shellfish',
  'fish',
  'sesame',
  'vegan',
  'vegetarian',
]

export const CUISINE_TYPES = [
  'American',
  'Canadian',
  'Chinese',
  'French',
  'Greek',
  'Indian',
  'Italian',
  'Japanese',
  'Korean',
  'Mediterranean',
  'Mexican',
  'Middle Eastern',
  'Plant-based',
  'Thai',
  'Vegan',
  'Vegetarian',
  'Vietnamese',
  'Other',
]

export const RATING_LABELS = {
  overall_score: 'Overall Allergy Friendliness',
  staff_knowledge_score: 'Staff Knowledge',
  menu_options_score: 'Menu Options',
  cross_contamination_score: 'Cross-Contamination Care',
}
