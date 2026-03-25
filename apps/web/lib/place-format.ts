import type { Place } from '@/types/place'

export const formatLocation = (place: Pick<Place, 'city' | 'country'>) => {
  return `${place.city}, ${place.country}`
}

export const formatPlaceImageAlt = (place: Pick<Place, 'name' | 'city'>) => {
  return `Photo of ${place.name} in ${place.city}`
}
