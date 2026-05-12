import { useProduct } from 'vtex.product-context'
import getProductSpecGroup from '../utils/getProductSpecGroup'

const useProductSpecGroup = (name: string) => {
  const ctx = useProduct()

  const specificationGroups = ctx?.product?.specificationGroups ?? null
  return getProductSpecGroup(specificationGroups, name)
}

export default useProductSpecGroup
