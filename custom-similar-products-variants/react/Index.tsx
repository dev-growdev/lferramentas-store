import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import useProductSimilars from './hooks/useProductSimilars'
import getUniqueProducts from './utils/getUniqueProducts'
import getImageLabelIndex from './utils/getImageLabelIndex'
import Variant from './components/Variant'
import Title from './components/Title'
import useCurrentProduct from './hooks/useCurrentProduct'
import getPropertyValue from './utils/getPropertyValue'
import verifyProductAvailability from './utils/verifySkuAvailability'

interface SimilarProductsVariantsProps {
  productQuery: {
    product: {
      productId: string
    }
  }
  imageLabel?: string
  blockClass?: string | string[]
  prodSpecName?: string
}

const CSS_HANDLES = [
  'variants',
  'title',
  'var-wrap',
  'img_wrap',
  'img',
] as const

const SimilarProductsVariants: StorefrontFunctionComponent<SimilarProductsVariantsProps> = ({
  productQuery,
  imageLabel,
  prodSpecName,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const currentProduct = useCurrentProduct()

  const { data, loading, error } = useProductSimilars(
    productQuery?.product?.productId
  )

  if (!data || loading || error) return null

  const { productRecommendations } = data

  if (!productRecommendations) return null

  if (productRecommendations?.length <= 0) return null

  const uniqueRecommendations = getUniqueProducts(productRecommendations || [])

  const allProducts = [currentProduct, ...uniqueRecommendations]

  return (
    <div className={`${handles.variants}`}>
      <Title />
      <div className={handles['var-wrap']}>
        {allProducts.map(product => {
          if (!product) return null

          const {
            productId,
            productName,
            items,
            linkText,
            properties,
          } = product

          const selectedItem = items?.[0]

          const isAvailable = verifyProductAvailability(selectedItem)

          const imgs = selectedItem?.images
          const imageIndex = getImageLabelIndex(imgs, imageLabel)
          const srcImage = imgs?.[imageIndex]?.imageUrl

          const specValue = getPropertyValue(prodSpecName, properties)

          return (
            <Variant
              key={productId}
              productId={productId ?? undefined}
              productName={productName ?? undefined}
              linkText={linkText ?? undefined}
              srcImage={srcImage ?? undefined}
              specValue={specValue}
              isAvailable={isAvailable}
            />
          )
        })}
      </div>
    </div>
  )
}

SimilarProductsVariants.schema = {
  title: 'SimilarProducts Variants',
  description: 'SimilarProducts Variants',
  type: 'object',
  properties: {},
}

export default SimilarProductsVariants
