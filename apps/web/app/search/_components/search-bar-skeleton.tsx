import { Skeleton } from '@naboo/design-system'

const SearchBarSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Skeleton className="h-9 flex-1" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-19" />
      </div>
    </div>
  )
}

export { SearchBarSkeleton }
