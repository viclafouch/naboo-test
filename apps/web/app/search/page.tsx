import * as React from 'react'
import type { Metadata } from 'next'
import type { SearchParams } from 'nuqs/server'
import { PlaceCardSkeletonGrid } from './_components/place-card-skeleton'
import { SearchBar } from './_components/search-bar'
import { searchParamsCache } from './_components/search-params'
import { SearchResults } from './_components/search-results'

export const metadata = {
  title: 'Search places'
} satisfies Metadata

type SearchPageParams = {
  searchParams: Promise<SearchParams>
}

const SearchPage = async ({ searchParams }: SearchPageParams) => {
  const {
    q: query,
    category,
    page
  } = await searchParamsCache.parse(searchParams)
  const currentPage = Math.max(1, Number(page))

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Find your next stay</h1>
          <p className="text-muted-foreground">
            Search apartments, houses, and villas worldwide
          </p>
        </div>
        <SearchBar />
        <React.Suspense
          key={`${query}-${category}-${currentPage}`}
          fallback={<PlaceCardSkeletonGrid />}
        >
          <SearchResults query={query} category={category} page={currentPage} />
        </React.Suspense>
      </div>
    </main>
  )
}

export default SearchPage
