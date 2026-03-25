import Image from 'next/image'
import Link from 'next/link'
import { StarIcon } from 'lucide-react'
import { CATEGORY_LABELS, PRICE_UNIT } from '@/constants/place'
import { formatPrice, formatRating } from '@/helpers/format'
import { formatLocation, formatPlaceImageAlt } from '@/lib/place-format'
import type { Place } from '@/types/place'
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@naboo/design-system'

type PlaceCardParams = {
  place: Place
  isPriority?: boolean
}

const PlaceCard = ({ place, isPriority = false }: PlaceCardParams) => {
  return (
    <Link href={`/places/${place.slug}`} className="group">
      <Card className="transition-shadow group-hover:shadow-lg">
        <Image
          src={place.imageUrl}
          alt={formatPlaceImageAlt(place)}
          width={800}
          height={600}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={isPriority}
          className="aspect-4/3 object-cover"
        />
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle>{place.name}</CardTitle>
            <Badge variant="secondary">{CATEGORY_LABELS[place.category]}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatLocation(place)}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="font-semibold">
              {formatPrice(place.pricePerNight)}
              <span className="font-normal text-muted-foreground">
                {PRICE_UNIT}
              </span>
            </p>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <StarIcon
                className="size-3.5 fill-primary text-primary"
                aria-hidden
              />
              {formatRating(place.rating)} ({place.reviewCount})
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export { PlaceCard }
