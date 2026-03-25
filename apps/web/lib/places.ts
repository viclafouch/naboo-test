import * as React from 'react'
import {
  PLACES_PER_PAGE,
  SEARCH_FAILURE_RATE,
  SEARCH_MAX_DELAY_MS
} from '@/constants/place'
import { getPlaces } from '@/data/places'
import type { Place, SearchPlacesParams } from '@/types/place'

const sleep = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

const matchesQuery = (place: Place, query: string) => {
  const lowerQuery = query.toLowerCase()

  return (
    place.name.toLowerCase().includes(lowerQuery) ||
    place.city.toLowerCase().includes(lowerQuery) ||
    place.country.toLowerCase().includes(lowerQuery)
  )
}

export const searchPlaces = async ({
  query,
  category,
  page = 1
}: SearchPlacesParams) => {
  const [, places] = await Promise.all([
    sleep(Math.random() * SEARCH_MAX_DELAY_MS),
    getPlaces()
  ])

  if (SEARCH_FAILURE_RATE > 0 && Math.random() < SEARCH_FAILURE_RATE) {
    throw new Error('Search service temporarily unavailable')
  }

  const filtered = places.filter((place) => {
    const isMatchingQuery = query ? matchesQuery(place, query) : true
    const isMatchingCategory = category ? place.category === category : true

    return isMatchingQuery && isMatchingCategory
  })

  const totalCount = filtered.length
  const totalPages = Math.ceil(totalCount / PLACES_PER_PAGE)
  const startIndex = (page - 1) * PLACES_PER_PAGE
  const paginatedPlaces = filtered.slice(
    startIndex,
    startIndex + PLACES_PER_PAGE
  )

  return {
    places: paginatedPlaces,
    totalCount,
    totalPages,
    currentPage: page
  }
}

export const getPlaceBySlug = React.cache(async (slug: Place['slug']) => {
  const places = await getPlaces()

  return places.find((place) => {
    return place.slug === slug
  })
})

export const getAllSlugs = async () => {
  const places = await getPlaces()

  return places.map((place) => {
    return place.slug
  })
}
