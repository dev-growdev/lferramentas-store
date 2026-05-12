import type { Maybe, Sku } from 'vtex.store-graphql'

import getDefaultSeller from './getDefaultSeller'

const verifyProductAvailability = (sku: Maybe<Sku> | undefined) => {
  const sellers = sku?.sellers

  const defaultSeller = getDefaultSeller(sellers)

  const availableQuantity =
    defaultSeller?.commertialOffer?.AvailableQuantity ?? 0

  const isAvailable = availableQuantity > 0

  return isAvailable
}

export default verifyProductAvailability
