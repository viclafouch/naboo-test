export const PLACES_PER_PAGE = 9

export const CATEGORIES = [
  'apartment',
  'house',
  'villa'
] as const satisfies readonly string[]

export const CATEGORY_LABELS = {
  apartment: 'Apartment',
  house: 'House',
  villa: 'Villa'
} as const satisfies Record<(typeof CATEGORIES)[number], string>

export const PRICE_UNIT = '/night'

export const SEARCH_MAX_DELAY_MS = 600

export const SEARCH_FAILURE_RATE = 0
