export interface CouponScheduling {
  dateStart?: string
  dateEnd?: string
}

export interface CouponCollectionLink {
  value?: number | string
}

export interface CouponConfig {
  __editorItemTitle?: string
  isActive?: boolean
  couponCode?: string
  priority?: number | string
  withoutLink?: boolean
  scheduling?: CouponScheduling
  collections?: CouponCollectionLink[]
}

interface ProductCluster {
  id?: string | number
}

interface ProductWithClusters {
  productClusters?: ProductCluster[] | null
  clusterHighlights?: ProductCluster[] | null
}

// Mesma regra dos selos (custom-flags): data vazia ou inválida é ignorada.
export const isSchedulingValid = (
  scheduling: CouponScheduling | undefined,
  now: Date
) => {
  if (!scheduling) return true

  if (scheduling.dateStart) {
    const start = new Date(scheduling.dateStart)

    if (!isNaN(start.getTime()) && now < start) return false
  }

  if (scheduling.dateEnd) {
    const end = new Date(scheduling.dateEnd)

    if (!isNaN(end.getTime()) && now > end) return false
  }

  return true
}

const getProductCollectionIds = (product?: ProductWithClusters | null) => {
  const clusters = [
    ...(product?.productClusters ?? []),
    ...(product?.clusterHighlights ?? []),
  ]

  return new Set(
    clusters.map(cluster => String(cluster?.id ?? '')).filter(Boolean)
  )
}

const matchesCollection = (
  coupon: CouponConfig,
  productCollectionIds: Set<string>
) => {
  if (coupon.withoutLink) return true

  return (coupon.collections ?? []).some(
    ({ value }) =>
      value !== undefined &&
      value !== null &&
      productCollectionIds.has(String(value).trim())
  )
}

/**
 * Retorna o cupom a exibir no produto: ativo, dentro do agendamento e vinculado
 * a uma coleção do produto. Em empate, maior prioridade vence; depois, a ordem da lista.
 */
export const resolveCoupon = (
  coupons: CouponConfig[] | undefined,
  product: ProductWithClusters | null | undefined,
  now: Date
) => {
  if (!coupons?.length) return null

  const productCollectionIds = getProductCollectionIds(product)

  const [match] = coupons
    .map((coupon, index) => ({ coupon, index }))
    .filter(
      ({ coupon }) =>
        coupon.isActive !== false &&
        !!coupon.couponCode?.trim() &&
        isSchedulingValid(coupon.scheduling, now) &&
        matchesCollection(coupon, productCollectionIds)
    )
    .sort(
      (a, b) =>
        Number(b.coupon.priority ?? 0) - Number(a.coupon.priority ?? 0) ||
        a.index - b.index
    )

  return match?.coupon ?? null
}
