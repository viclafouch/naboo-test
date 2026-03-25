import Image from 'next/image'
import Link from 'next/link'
import { CATEGORY_LABELS, PRICE_UNIT } from '@/constants/place'
import {
  formatLocation,
  formatPlaceImageAlt,
  formatPrice,
  formatRating
} from '@/helpers/format'
import type { Place } from '@/types/place'
import { Badge, Button } from '@naboo/design-system'

type PlaceDetailParams = {
  place: Place
}

const PlaceDetail = ({ place }: PlaceDetailParams) => {
  return (
    <article className="flex flex-col gap-8">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/search" />}
      >
        ← Back to search
      </Button>
      <Image
        src={place.imageUrl}
        alt={formatPlaceImageAlt(place)}
        width={1200}
        height={675}
        priority
        sizes="(min-width: 920px) 896px, calc(100vw - 48px)"
        className="aspect-video w-full rounded-xl object-cover"
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{place.name}</h1>
            <Badge variant="secondary">{CATEGORY_LABELS[place.category]}</Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            {formatLocation(place)}
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">★</span>
            <span className="font-semibold">{formatRating(place.rating)}</span>
            <span className="text-muted-foreground">
              ({place.reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-bold">
              {formatPrice(place.pricePerNight)}
            </span>
            <span className="text-muted-foreground">{PRICE_UNIT}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            {place.capacity.guests} guests · {place.capacity.bedrooms} bedrooms
          </div>
        </div>
        <div className="h-px bg-border" />
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          {place.description}
        </p>
      </div>
    </article>
  )
}

export { PlaceDetail }
