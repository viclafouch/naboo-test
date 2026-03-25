import { searchPlaces } from '@/lib/places'
import { EmptyState } from './empty-state'
import { PlaceCard } from './place-card'
import { PLACES_GRID_CLASS } from './place-card-skeleton'
import { SearchPagination } from './search-pagination'

type SearchResultsParams = {
  query?: string
  category?: string
  page: number
}

const SearchResults = async ({
  query,
  category,
  page
}: SearchResultsParams) => {
  const result = await searchPlaces({ query, category, page })

  if (result.totalCount === 0) {
    return <EmptyState />
  }

  return (
    <div className="flex flex-col gap-8">
      <div aria-live="polite" className="sr-only">
        {result.totalCount} place{result.totalCount > 1 ? 's' : ''} found
      </div>
      <div className={PLACES_GRID_CLASS}>
        {result.places.map((place, index) => {
          return (
            <PlaceCard key={place.id} place={place} isPriority={index === 0} />
          )
        })}
      </div>
      {result.totalPages > 1 ? (
        <SearchPagination
          currentPage={result.currentPage}
          totalPages={result.totalPages}
        />
      ) : null}
    </div>
  )
}

export { SearchResults }
