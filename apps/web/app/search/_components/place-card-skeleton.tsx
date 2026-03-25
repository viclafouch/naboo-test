import { PLACES_PER_PAGE } from '@/constants/place'
import { Card, Skeleton } from '@naboo/design-system'

export const PLACES_GRID_CLASS =
  'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'

const PlaceCardSkeleton = () => {
  return (
    <Card className="pt-0">
      <Skeleton className="aspect-4/3 w-full rounded-t-xl" />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </Card>
  )
}

const PlaceCardSkeletonGrid = () => {
  return (
    <div className={PLACES_GRID_CLASS}>
      {Array.from({ length: PLACES_PER_PAGE }, (_value, index) => {
        return <PlaceCardSkeleton key={index} />
      })}
    </div>
  )
}

export { PlaceCardSkeletonGrid }
