'use client'

import * as React from 'react'
import { useQueryStates } from 'nuqs'
import { CATEGORIES, CATEGORY_LABELS } from '@/constants/place'
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@naboo/design-system'
import { searchParamsParsers } from './search-params'

const SearchBar = () => {
  const [isLoading, startTransition] = React.useTransition()
  const [params, setParams] = useQueryStates(searchParamsParsers, {
    shallow: false,
    startTransition
  })
  const [inputValue, setInputValue] = React.useState(params.q)

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    void setParams({
      q: inputValue || null,
      page: null
    })
  }

  const handleCategoryChange = (value: string | null) => {
    void setParams({
      category: value || null,
      page: null
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
      role="search"
      aria-label="Search places"
      aria-busy={isLoading}
    >
      <Input
        type="search"
        placeholder="Search by name, city, or country…"
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value)
        }}
        aria-label="Search query"
        className="flex-1"
      />
      <div className="flex gap-2">
        <Select value={params.category} onValueChange={handleCategoryChange}>
          <SelectTrigger aria-label="Filter by category" className="w-36">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All types</SelectItem>
            {CATEGORIES.map((category) => {
              return (
                <SelectItem key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching…' : 'Search'}
        </Button>
      </div>
    </form>
  )
}

export { SearchBar }
