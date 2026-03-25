import type { Place } from '@/types/place'

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0
})

export const formatPrice = (price: number) => {
  return priceFormatter.format(price)
}

export const formatRating = (rating: number) => {
  return rating.toFixed(1)
}

export const formatLocation = (place: Pick<Place, 'city' | 'country'>) => {
  return `${place.city}, ${place.country}`
}

export const formatPlaceImageAlt = (place: Pick<Place, 'name' | 'city'>) => {
  return `Photo of ${place.name} in ${place.city}`
}
