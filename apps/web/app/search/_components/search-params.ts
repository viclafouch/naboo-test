import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum
} from 'nuqs/server'
import { CATEGORIES } from '@/constants/place'

export const searchParamsParsers = {
  q: parseAsString.withDefault(''),
  category: parseAsStringEnum([...CATEGORIES]),
  page: parseAsInteger.withDefault(1)
}

export const searchParamsCache = createSearchParamsCache(searchParamsParsers)
