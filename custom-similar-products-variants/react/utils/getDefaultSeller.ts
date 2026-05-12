import type { Maybe, Seller } from 'vtex.store-graphql'

const getDefaultSeller = (
  sellers?: Array<Maybe<Seller>> | undefined | null
) => {
  if (!sellers || sellers.length === 0) {
    return
  }

  const defaultSeller = sellers.find(seller => seller?.sellerDefault)

  if (defaultSeller) {
    return defaultSeller
  }

  return sellers[0]
}

export default getDefaultSeller
