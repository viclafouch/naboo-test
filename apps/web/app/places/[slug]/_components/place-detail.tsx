import Image from 'next/image'
import Link from 'next/link'
import {
  BedDoubleIcon,
  ChevronLeftIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon
} from 'lucide-react'
import { CATEGORY_LABELS, PRICE_UNIT } from '@/constants/place'
import { formatPrice, formatRating } from '@/helpers/format'
import { formatLocation, formatPlaceImageAlt } from '@/lib/place-format'
import type { Place } from '@/types/place'
import { Badge, Button } from '@naboo/design-system'

type PlaceDetailParams = {
  place: Place
}

const PlaceDetail = ({ place }: PlaceDetailParams) => {
  return (
    <article className="flex flex-col gap-6">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/search" />}
        className="w-fit"
      >
        <ChevronLeftIcon data-icon="inline-start" />
        Back to search
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
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{place.name}</h1>
            <Badge variant="secondary">{CATEGORY_LABELS[place.category]}</Badge>
          </div>
          <p className="flex items-center gap-1.5 text-lg text-muted-foreground">
            <MapPinIcon className="size-4" aria-hidden />
            {formatLocation(place)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 rounded-xl bg-accent/50 px-5 py-4 text-sm">
          <div className="flex items-center gap-1.5">
            <StarIcon
              className="size-4 fill-primary text-primary"
              aria-hidden
            />
            <span className="font-semibold">{formatRating(place.rating)}</span>
            <span className="text-muted-foreground">
              ({place.reviewCount} reviews)
            </span>
          </div>
          <div aria-hidden className="h-4 w-px bg-border" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(place.pricePerNight)}
            </span>
            <span className="text-muted-foreground">{PRICE_UNIT}</span>
          </div>
          <div aria-hidden className="h-4 w-px bg-border" />
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <UsersIcon className="size-4" aria-hidden />
              {place.capacity.guests} guests
            </span>
            <span className="flex items-center gap-1.5">
              <BedDoubleIcon className="size-4" aria-hidden />
              {place.capacity.bedrooms} bedrooms
            </span>
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
