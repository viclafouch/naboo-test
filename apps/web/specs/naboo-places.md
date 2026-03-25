# Naboo Places — Test Plan

## App Overview

Place discovery platform at `http://localhost:3000`. Three pages: homepage (`/`), search (`/search`), place detail (`/places/[slug]`). Uses nuqs for URL state, shadcn/ui components with `data-slot` attributes, React Suspense for streaming results.

## Test 1: Search page displays results

- Navigate to `/search`
- Verify the page title "Find your next stay" is visible
- Verify the search input is visible with placeholder "Search by name, city, or country…"
- Verify the category filter select is visible
- Verify the search button is visible
- Verify place cards are displayed (at least 1 card with `data-slot="card"`)
- Verify each card shows a title, image, location, price, and rating

## Test 2: Search by query filters results

- Navigate to `/search`
- Type "paris" in the search input
- Click the "Search" button
- Verify the URL contains `?q=paris`
- Verify only places matching "paris" are displayed
- Clear the search input and search with empty query
- Verify all results are shown again and `q` is removed from URL

## Test 3: Filter by category

- Navigate to `/search`
- Click the category filter trigger ("All types")
- Select "Villa" from the dropdown
- Verify the URL contains `category=villa`
- Verify all displayed cards show the "Villa" badge
- Reset the filter to "All types"
- Verify `category` is removed from the URL

## Test 4: Pagination

- Navigate to `/search`
- Verify the pagination navigation is visible
- Click on page 2
- Verify the URL contains `page=2`
- Verify the results have changed (different cards than page 1)
- Reload the page
- Verify the URL still contains `page=2`
- Verify the same results are displayed after reload

## Test 5: URL state sharing

- Navigate to `/search?q=paris&page=1`
- Verify results are filtered for "paris"
- Verify the search input contains "paris"
- Copy the current URL, navigate to it in a new context
- Verify the same results are displayed

## Test 6: Place detail page

- Navigate to `/search`
- Note the title of the first place card
- Click the first place card
- Verify the URL matches `/places/[slug]`
- Verify the page shows the place name as an `h1` heading
- Verify the hero image is visible
- Verify the rating (star icon), price, guest count, and bedroom count are displayed
- Verify the "Back to search" link is visible

## Test 7: Navigation back to search

- Navigate to `/search`
- Click the first place card to go to the detail page
- Click the "Back to search" link
- Verify the URL is `/search`
- Verify place cards are displayed again

## Test 8: Empty state

- Navigate to `/search`
- Type "xyznonexistent" in the search input and submit
- Verify the empty state message "No places found" is displayed
- Verify no place cards are shown

## Test 9: Homepage navigation

- Navigate to `/`
- Verify the title "Naboo Places" is visible
- Verify the "Browse places" link is visible
- Click "Browse places"
- Verify the URL is `/search`
- Verify search results are displayed
