import type { ProductTypes } from 'vtex.product-context'

type Spec = ProductTypes.ProductSpecification | null | undefined
type Properties = Spec[] | null | undefined

const getProductProperty = (properties: Properties, propertyName: string) => {
  if (!properties) return null

  const emptyProperties = properties.length <= 0

  if (emptyProperties) return null

  const propertyMatch = properties.find(p => p?.name === propertyName)

  return propertyMatch ?? null
}

export default getProductProperty
