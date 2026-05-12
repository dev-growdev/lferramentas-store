import { useQuery } from 'react-apollo'
import { useProduct } from 'vtex.product-context'
import { QueryProductRecommendations } from 'vtex.store-resources'
import type {
  QueryProductRecommendationsArgs,
  Product,
} from 'vtex.store-graphql'

type QueryProductRecommendationsData = {
  productRecommendations: Product[]
}

const useProductSimilars = (productId?: string) => {
  const ctx = useProduct()
  const prodId = productId ?? ctx?.product?.productId

  return useQuery<
    QueryProductRecommendationsData,
    QueryProductRecommendationsArgs
  >(QueryProductRecommendations, {
    variables: {
      identifier: { field: 'id', value: prodId ?? '' },
      type: `similars`,
    },
    fetchPolicy: 'no-cache',
    ssr: true,
    skip: !prodId,
  })
}

export default useProductSimilars
