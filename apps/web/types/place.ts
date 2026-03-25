import type { CATEGORIES } from '@/constants/place'

export type PlaceCategory = (typeof CATEGORIES)[number]

export type Place = {
  id: string
  slug: string
  name: string
  description: string
  city: string
  country: string
  pricePerNight: number
  imageUrl: string
  rating: number
  reviewCount: number
  category: PlaceCategory
  capacity: {
    guests: number
    bedrooms: number
  }
}

export type SearchPlacesParams = {
  query?: string
  category?: PlaceCategory
  page?: number
}
