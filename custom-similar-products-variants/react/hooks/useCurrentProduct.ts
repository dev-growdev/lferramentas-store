import { useProduct } from 'vtex.product-context'

const useCurrentProduct = () => {
  const ctx = useProduct()

  return ctx?.product
}

export default useCurrentProduct
