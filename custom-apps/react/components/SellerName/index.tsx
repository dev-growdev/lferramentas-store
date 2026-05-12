import React from 'react'
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'seller-p',
  'seller-link'
] as const

function SellerName() {
  const handles = useCssHandles(CSS_HANDLES)
  const contextValue = useProduct()


  const toggleSellerName = () => {
    let itemsFilted = contextValue?.product?.items.filter((item: any) => item.sellers.length > 1 && item.sellers[0].sellerName !== 'GZT Store') || []

    if (itemsFilted?.length > 0) {
      return itemsFilted[0].sellers[0].sellerName
    } else {
      return contextValue?.product?.items[0].sellers[0].sellerName
    }
  }


  return (
    <>
      <p className={handles.handles['seller-p']}>Vendido e entregue por: <span className={handles.handles['seller-link']}>{toggleSellerName()}</span></p>
    </>
  );
}

export default SellerName
