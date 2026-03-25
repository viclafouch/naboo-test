'use client'

import { Button } from '@naboo/design-system'

type SearchErrorParams = {
  reset: () => void
}

const SearchError = ({ reset }: SearchErrorParams) => {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-4xl">⚠️</p>
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="max-w-sm text-muted-foreground">
        An error occurred while loading the search results. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}

export default SearchError
