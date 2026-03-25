import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { formatLocation } from '@/helpers/format'
import { getAllSlugs, getPlaceBySlug } from '@/lib/places'
import { PlaceDetail } from './_components/place-detail'

type PlacePageParams = {
  params: Promise<{ slug: string }>
}

export const generateStaticParams = async () => {
  const slugs = await getAllSlugs()

  return slugs.map((slug) => {
    return { slug }
  })
}

export const generateMetadata = async ({ params }: PlacePageParams) => {
  const { slug } = await params
  const place = await getPlaceBySlug(slug)

  if (!place) {
    return { title: 'Place not found' } satisfies Metadata
  }

  return {
    title: place.name,
    description: `${place.name} in ${formatLocation(place)}. ${place.description.slice(0, 150)}…`,
    openGraph: {
      title: place.name,
      description: place.description,
      images: [place.imageUrl]
    }
  } satisfies Metadata
}

const PlacePage = async ({ params }: PlacePageParams) => {
  const { slug } = await params
  const place = await getPlaceBySlug(slug)

  if (!place) {
    notFound()
  }

  return (
    <main id="main-content" className="mx-auto w-full max-w-4xl px-6 py-8">
      <PlaceDetail place={place} />
    </main>
  )
}

export default PlacePage
