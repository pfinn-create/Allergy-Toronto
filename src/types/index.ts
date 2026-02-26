export type AllergyType =
  | 'gluten'
  | 'nuts'
  | 'peanuts'
  | 'dairy'
  | 'eggs'
  | 'soy'
  | 'shellfish'
  | 'fish'
  | 'sesame'
  | 'vegan'
  | 'vegetarian'

export type Neighborhood =
  | 'Downtown'
  | 'Midtown'
  | 'East End'
  | 'West End'
  | 'North York'
  | 'Scarborough'
  | 'Etobicoke'
  | 'Yorkville'
  | 'Kensington Market'
  | 'Queen West'
  | 'Leslieville'
  | 'The Annex'
  | 'Little Italy'
  | 'Chinatown'
  | 'Distillery District'
  | 'Liberty Village'
  | 'Roncesvalles'
  | 'Danforth'

export interface Place {
  id: string
  name: string
  address: string
  neighborhood: Neighborhood
  cuisine_type: string
  description: string
  phone?: string
  website?: string
  latitude?: number
  longitude?: number
  created_at: string
  created_by?: string
  approved: boolean
  average_rating?: number
  rating_count?: number
  allergies?: AllergyType[]
}

export interface Rating {
  id: string
  place_id: string
  user_id: string
  overall_score: number
  staff_knowledge_score: number
  menu_options_score: number
  cross_contamination_score: number
  review_text?: string
  allergies_mentioned?: AllergyType[]
  created_at: string
  user_email?: string
}

export interface PlaceWithRatings extends Place {
  ratings: Rating[]
}

export interface SearchFilters {
  query: string
  neighborhood: string
  allergy: string
  minRating: number
}
