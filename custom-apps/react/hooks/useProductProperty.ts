import { useProduct } from 'vtex.product-context'
import getProductProperty from '../utils/getProductProperty'

const useProductProperty = (name: string) => {
  const ctx = useProduct()

  const properties = ctx?.product?.properties ?? null

  return getProductProperty(properties, name)
}

export default useProductProperty
