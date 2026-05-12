/* eslint-disable  */
import React, { useEffect, useState } from 'react'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import { usePixel } from 'vtex.pixel-manager'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import { mapCartItemToPixel } from '../AddToCartButton/pixelHelper'
import useMarketingSessionParams from '../AddToCartButton/hooks/useMarketingSessionParams'

interface IOrderForm {
  orderForm: OrderForm
  setOrderForm: React.Dispatch<React.SetStateAction<OrderForm>>
}

const AddToCartFunction = () => {
  const [isAdding, setIsAdding] = useState(false)
  const { addItems } = useOrderItems()
  const { push } = usePixel()
  const { utmParams, utmiParams } = useMarketingSessionParams()
  const {
    orderForm: { items },
  }: IOrderForm = useOrderForm()

  const addToCart = async (
    productId: string,
    quantity: number,
    sellerId: string
  ) => {
    const skuItem = [
      {
        id: Number(productId),
        quantity: Number(quantity) || 1,
        seller: sellerId ?? '1',
      },
    ]

    await addItems(skuItem, { marketingData: { ...utmParams, ...utmiParams } })

    setIsAdding(true)
  }

  useEffect(() => {
    if (window !== undefined && !window.AddToCart) {
      window.AddToCart = addToCart
    }

    return () => {
      if (window !== undefined && window.AddToCart) {
        delete window.AddToCart
      }
    }
  }, [addItems, push, utmParams, utmiParams, items])

  useEffect(() => { 
    if (!isAdding) return

    const pixelEventItems = items?.map(mapCartItemToPixel)

    push({
      id: 'add-to-cart-button',
      event: 'addToCart',
      items: pixelEventItems,
    })

    setIsAdding(false)
  }, [items, isAdding])

  return <></>
}

export default AddToCartFunction
