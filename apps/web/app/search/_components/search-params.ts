import { createSearchParamsCache, parseAsString } from 'nuqs/server'

export const searchParamsParsers = {
  q: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  page: parseAsString.withDefault('1')
}

export const searchParamsCache = createSearchParamsCache(searchParamsParsers)
