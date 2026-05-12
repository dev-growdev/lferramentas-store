import React from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { ProductContextState } from 'vtex.product-context/react/ProductContextProvider'

function ConditionalSKUSelector({ SkuSelector, DefaultPrice, DefaultSkuSelector }: any) {
  const contextValue: ProductContextState = useProduct()
  const renderSKUSelector = contextValue?.product?.items && contextValue?.product?.items.length > 2

  const renderBlocks = () => {
    if (!SkuSelector || !DefaultPrice || !DefaultSkuSelector) {
      console.error("SkuSelector or DefaultPrice or DefaultSkuSelector Block not found")
      return null
    }

    if (renderSKUSelector) {
      return <SkuSelector />
    }


    return <>
      <DefaultSkuSelector />
      <DefaultPrice />
    </>
  }

  return (
    <>
      {renderBlocks()}
    </>
  );
}

export default ConditionalSKUSelector
