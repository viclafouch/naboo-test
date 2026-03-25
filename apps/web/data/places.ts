import type { Place } from '@/types/place'

export const getPlaces = async () => {
  const { default: placesJson } = await import('./places.json')

  return placesJson as Place[]
}
