import React from 'react'
import useProduct from 'vtex.product-context/useProduct'

interface ProductContext {
  selectedItem: object
}

const ProductNameSkuHelper = () => {
  const productCtx: ProductContext = useProduct()

  const removeDuplicatedProductName = (productNames: HTMLCollection) => {
    if (productNames.length == 1) {
      return
    }

    if (productNames[0]?.textContent?.replace(/\s/g, '').toLocaleLowerCase() == productNames[1]?.textContent?.replace(/\s/g, '').toLocaleLowerCase()) {
    productNames[1].textContent = ''
      return
    }

    const originalName = productNames[0]?.textContent ?? ''

    if (productNames[1]?.textContent?.includes(originalName)) {
      const sku = productNames[1]?.textContent?.replace(originalName, '') ?? ''
      productNames[1].textContent = sku
    }
  }

  React.useEffect(() => {
    const productNames = window.document?.getElementsByClassName('vtex-store-components-3-x-productBrand')
    removeDuplicatedProductName(productNames)
  }, [productCtx.selectedItem])

  return <></>
}

export default ProductNameSkuHelper
