import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { formatCurrency } from '../../utils/pricePix'
import React, { useEffect, useRef, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { cartSimulationForMultipleItems } from '../PaymentModal/utils/getMultiplePromotionPrice'
import Skeleton from '../Skeleton'

const CSS_HANDLES = [
  'summaryItemLabel',
  'summaryItemPrice',
  'summaryItemPriceAuxiliaryText',
  'summaryItemListPrice',
  'summaryItemError',
] as const

function getItemsHash(items: any[]) {
  return items.map(i => `${i.id}:${i.quantity}:${i.seller}`).join('|')
}

export const CustomMinicartTotalPrice = () => {
  const {
    orderForm,
    orderForm: { items },
  } = useOrderForm()
  const { handles } = useCssHandles(CSS_HANDLES, {
    migrationFrom: 'vtex.checkout-summary@0.x',
  })
  const [pixPrice, setPixPrice] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const lastRequest = useRef<number>(0)
  const itemsHash = getItemsHash(items)

  useEffect(() => {
    if (!items.length) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(false)
    lastRequest.current += 1
    const thisRequest = lastRequest.current

    const itemsForSimulation = items.map(
      (item: { id: any; quantity: any; seller: any }) => ({
        id: item.id,
        quantity: item.quantity,
        seller: item.seller,
      })
    )

    cartSimulationForMultipleItems(itemsForSimulation, setPixPrice, '125')
      .then(() => {
        if (lastRequest.current === thisRequest) setLoading(false)
      })
      .catch(() => {
        if (lastRequest.current === thisRequest) {
          setError(true)
          setLoading(false)
        }
      })
  }, [itemsHash])

  const pixFinalPrice =
    pixPrice?.totals?.find((total: any) => total.id === 'Items')?.value / 100 ||
    0

  const pixDiscounts =
    pixPrice?.totals?.find((total: any) => total.id === 'Discounts')?.value /
      100 || 0

  const normalPrice =
    (orderForm?.totalizers?.find(
      (totalizer: { id: string }) => totalizer.id === 'Items'
    )?.value || 0) / 100

  const hasDiscounts = normalPrice > pixFinalPrice + pixDiscounts

  if (loading) {
    return <Skeleton />
  }

  if (error) {
    return <div className={handles.summaryItemError}>Ocorreu um erro</div>
  }

  return (
    <div className="flex justify-between items-start">
      <div className={handles.summaryItemLabel}>Total</div>
      <div>
        {pixFinalPrice > 0 && (
          <div className={handles.summaryItemPrice}>
            {formatCurrency(pixFinalPrice + pixDiscounts)}
            {hasDiscounts && (
              <span className={handles.summaryItemPriceAuxiliaryText}> ou</span>
            )}
          </div>
        )}
        {hasDiscounts && (
          <div className={handles.summaryItemListPrice}>
            {formatCurrency(normalPrice)} {pixFinalPrice > 0 && `a prazo`}
          </div>
        )}
      </div>
    </div>
  )
}
