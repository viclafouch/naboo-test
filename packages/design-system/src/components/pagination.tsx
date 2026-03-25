'use client'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon
} from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './button'

type PaginationParams = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

const SIBLINGS_COUNT = 1

const generatePageNumbers = (currentPage: number, totalPages: number) => {
  const rangeStart = Math.max(2, currentPage - SIBLINGS_COUNT)
  const rangeEnd = Math.min(totalPages - 1, currentPage + SIBLINGS_COUNT)

  const middlePages = Array.from(
    { length: rangeEnd - rangeStart + 1 },
    (_value, index) => {
      return rangeStart + index
    }
  )

  return [
    1,
    ...(rangeStart > 2 ? (['ellipsis'] as const) : []),
    ...middlePages,
    ...(rangeEnd < totalPages - 1 ? (['ellipsis'] as const) : []),
    ...(totalPages > 1 ? [totalPages] : [])
  ]
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className
}: PaginationParams) => {
  const pages = generatePageNumbers(currentPage, totalPages)
  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= totalPages

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center gap-1', className)}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={isFirstPage}
        onClick={() => {
          onPageChange(currentPage - 1)
        }}
        aria-label="Previous page"
      >
        <ChevronLeftIcon data-icon="inline-start" />
      </Button>
      {pages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex size-7 items-center justify-center"
              aria-hidden
            >
              <MoreHorizontalIcon className="size-4 text-muted-foreground" />
            </span>
          )
        }

        const isActive = page === currentPage

        return (
          <Button
            key={page}
            variant={isActive ? 'default' : 'ghost'}
            size="icon-sm"
            onClick={() => {
              onPageChange(page)
            }}
            aria-label={`Page ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </Button>
        )
      })}
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={isLastPage}
        onClick={() => {
          onPageChange(currentPage + 1)
        }}
        aria-label="Next page"
      >
        <ChevronRightIcon data-icon="inline-end" />
      </Button>
    </nav>
  )
}

export { Pagination }
