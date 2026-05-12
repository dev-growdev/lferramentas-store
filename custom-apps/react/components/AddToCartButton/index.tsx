import React, { useContext, useState, useEffect } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { ToastContext } from 'vtex.styleguide'
import type { ToastContextType } from 'vtex.styleguide'
import { usePixel } from 'vtex.pixel-manager'
import { mapCartItemToPixel } from './pixelHelper'
import { QuantityStepper } from './components/QuantityStepper'
import { QuantityButton } from './components/QuantityButton'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import { operationQuantityItemOnMinicart } from './utils'
import { ProductContextState } from 'vtex.product-context/react/ProductTypes'
import useProduct from "vtex.product-context/useProduct";
import useMarketingSessionParams from './hooks/useMarketingSessionParams'

interface IAddToCart {
  showUnit: boolean;
  customSelectedItem?: ProductContextState['selectedItem'];
}

interface IOrderForm {
  orderForm: OrderForm
  setOrderForm: React.Dispatch<React.SetStateAction<OrderForm>>
}

const TOAST_TIMER = 2000;

export function AddToCartButton({ showUnit, customSelectedItem }: IAddToCart) {
  const [productQuantity, setProductQuantity] = useState(0)
  const [loading, setLoading] = useState(false)
  const { updateQuantity, addItems } = useOrderItems()
  const { showToast } = useContext<ToastContextType>(ToastContext)
  const { push } = usePixel()
  const { orderForm: { items } }: IOrderForm = useOrderForm()
  const { utmParams, utmiParams } = useMarketingSessionParams();
  const { selectedItem }: ProductContextState = useProduct()
  const finalSelectedItem = customSelectedItem || selectedItem
  const { itemId, sellerId, availableQuantity, productName, unit } = {
    itemId: finalSelectedItem?.itemId,
    sellerId: finalSelectedItem?.sellers[0]?.sellerId,
    availableQuantity: finalSelectedItem?.sellers[0]?.commertialOffer.AvailableQuantity,
    productName: finalSelectedItem?.name,
    unit: finalSelectedItem?.measurementUnit
  }

  const handleClickQuantity = async (
    operation: 'removeFromCart' | 'addToCart' | 'first-item'
  ) => {
    if (!availableQuantity || !productName) return
    setLoading(true)

    if (operation === 'first-item' && !!availableQuantity) {
      const skuItem = [
        {
          id: Number(itemId),
          quantity: 1,
          seller: sellerId,
        },
      ]
      await addItems(skuItem, { marketingData: { ...utmParams, ...utmiParams } })

      const pixelEventItems = items?.map(mapCartItemToPixel)

      push({
        id: 'add-to-cart-button',
        event: 'addToCart',
        items: pixelEventItems,
      })
      showToast({
        message: `Produto ${productName} adicionado ao carrinho.`,
        duration: TOAST_TIMER,
      })
      setLoading(false)
      return
    }

    if (
      (operation === 'addToCart' && productQuantity + 1 > availableQuantity) ||
      !availableQuantity
    ) {
      showToast({
        message: `Quantidade máxima atingida.`,
        duration: TOAST_TIMER,
      })
      setLoading(false)
      return
    }

    if (
      (operation === 'removeFromCart' && productQuantity - 1 < 0) ||
      !availableQuantity
    ) {
      setLoading(false)
      return
    }

    const operationValue = operationQuantityItemOnMinicart(
      operation,
      productQuantity,
      productName,
      TOAST_TIMER,
      showToast
    )

    updateQuantity(
      {
        seller: String(sellerId),
        quantity: operationValue,
        id: String(itemId),
      },
      { marketingData: { ...utmParams, ...utmiParams } }
    )

    setProductQuantity(operationValue)
    setLoading(false)
  }

  useEffect(() => {
    const [quantityOnCart] = items
      .filter((item) => item.id === itemId)
      .map((item) => item.quantity)

    setProductQuantity(quantityOnCart | 0)
  }, [itemId, items])

  return (
    <>
      {productQuantity >= 1 ? (
        <QuantityStepper
          handleClickQuantity={handleClickQuantity}
          productQuantity={productQuantity}
          unit={unit}
          showUnit={showUnit}
        />
      ) : (
        <>
          <QuantityButton
            AvailableQuantity={availableQuantity}
            handleClickQuantity={handleClickQuantity}
            loading={loading}
          />
        </>
      )}
    </>
  )
}
