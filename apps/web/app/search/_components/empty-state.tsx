const EmptyState = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-4xl">🏝️</p>
      <h2 className="text-xl font-semibold">No places found</h2>
      <p className="max-w-sm text-muted-foreground">
        Try adjusting your search query or removing the category filter to see
        more results.
      </p>
    </div>
  )
}

export { EmptyState }
