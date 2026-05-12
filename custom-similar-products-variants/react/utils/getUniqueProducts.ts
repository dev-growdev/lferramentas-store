import type { Product } from 'vtex.store-graphql'

const getUniqueProducts = (products: Product[]): Product[] => {
  const uniqueIds = [
    ...new Set<string>(products.map(item => item?.productId ?? '')),
  ]

  const uniqueProducts: Product[] = []

  uniqueIds.forEach(id => {
    const prod = products.find(element => element.productId === id)

    if (prod) uniqueProducts.push(prod)
  })

  return uniqueProducts
}

export default getUniqueProducts
