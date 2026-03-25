'use client'

import { useQueryStates } from 'nuqs'
import { Pagination } from '@naboo/design-system'
import { searchParamsParsers } from './search-params'

type SearchPaginationParams = {
  currentPage: number
  totalPages: number
}

const SearchPagination = ({
  currentPage,
  totalPages
}: SearchPaginationParams) => {
  const [, setParams] = useQueryStates(searchParamsParsers, {
    shallow: false
  })

  const handlePageChange = (page: number) => {
    void setParams({ page: page <= 1 ? null : String(page) })
  }

  return (
    <div className="flex justify-center">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export { SearchPagination }
