import type { ProductTypes } from 'vtex.product-context'

type Spec = ProductTypes.ProductSpecification | null | undefined

const getSpecificationValue = (specification: Spec) => {
  if (!specification) return null

  const { values } = specification

  const noValues = values.length <= 0

  if (noValues) return null

  const [value] = values

  return value
}

export default getSpecificationValue
