import type { ProductTypes } from 'vtex.product-context'

type Spec = ProductTypes.SpecificationGroup | null | undefined
type SpecGroup = Spec[] | null | undefined

const getProductSpecGroup = (specificationGroups: SpecGroup, specificationGroupName: string) => {
  if (!specificationGroups) return null

  const emptyspecificationGroups = specificationGroups.length <= 0

  if (emptyspecificationGroups) return null

  const specificationGroupMatch = specificationGroups.find(p => p?.name === specificationGroupName)

  return specificationGroupMatch ?? null
}

export default getProductSpecGroup
