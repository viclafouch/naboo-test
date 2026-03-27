import React from 'react'
import type { Metadata } from 'next'
import type { SearchParams } from 'nuqs/server'
import { PlaceCardSkeletonGrid } from './_components/place-card-skeleton'
import { SearchBar } from './_components/search-bar'
import { SearchBarSkeleton } from './_components/search-bar-skeleton'
import { searchParamsCache } from './_components/search-params'
import { SearchResults } from './_components/search-results'

export const metadata = {
  title: 'Search places'
} satisfies Metadata

type SearchPageParams = {
  searchParams: Promise<SearchParams>
}

const SearchResultsStream = async ({ searchParams }: SearchPageParams) => {
  const {
    q: query,
    category,
    page
  } = await searchParamsCache.parse(searchParams)
  const currentPage = Math.max(1, page)

  return (
    <SearchResults
      query={query}
      category={category ?? undefined}
      page={currentPage}
    />
  )
}

const SearchPage = ({ searchParams }: SearchPageParams) => {
  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Find your next stay</h1>
          <p className="text-muted-foreground">
            Search apartments, houses, and villas worldwide
          </p>
        </div>
        <React.Suspense fallback={<SearchBarSkeleton />}>
          <SearchBar />
        </React.Suspense>
        <React.Suspense fallback={<PlaceCardSkeletonGrid />}>
          <SearchResultsStream searchParams={searchParams} />
        </React.Suspense>
      </div>
    </main>
  )
}

export default SearchPage
