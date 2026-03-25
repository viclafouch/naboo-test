const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0
})

export const formatPrice = (price: number) => {
  return priceFormatter.format(price)
}

export const formatRating = (rating: number) => {
  return rating.toFixed(1)
}
