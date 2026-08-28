import { useProduct } from 'vtex.product-context'
import { formatCurrency } from '../../utils/pricePix'
import React, { useEffect, useRef, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { cartSimulationForMultipleItems } from '../PaymentModal/utils/getMultiplePromotionPrice'
import { getDefaultSeller } from '../ProductSummaryImage/modules/seller'
import Skeleton from '../Skeleton'

const CSS_HANDLES = ['spotPriceValue'] as const

export const CustomPdpSpotPrice = () => {
  const { handles } = useCssHandles(CSS_HANDLES, {
    migrationFrom: 'vtex.product-price@1.x',
  })
  const { selectedItem } = useProduct() ?? {}
  const seller = getDefaultSeller(selectedItem?.sellers)
  const itemId = selectedItem?.itemId
  const sellerId = seller?.sellerId

  const [pixPrice, setPixPrice] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const lastRequest = useRef<number>(0)

  useEffect(() => {
    if (!itemId || !sellerId) {
      setLoading(false)
      return
    }

    setLoading(true)
    lastRequest.current += 1
    const thisRequest = lastRequest.current

    const itemsForSimulation = [{ id: itemId, quantity: 1, seller: sellerId }]

    cartSimulationForMultipleItems(itemsForSimulation, setPixPrice, '125')
      .catch(() => {
        if (lastRequest.current === thisRequest) setPixPrice(null)
      })
      .then(() => {
        if (lastRequest.current === thisRequest) setLoading(false)
      })
  }, [itemId, sellerId])

  const normalPrice = seller?.commertialOffer?.Price || 0

  const pixFinalPrice =
    pixPrice?.totals?.find((total: any) => total.id === 'Items')?.value /
      100 || 0

  const pixDiscounts =
    pixPrice?.totals?.find((total: any) => total.id === 'Discounts')?.value /
      100 || 0

  const pixTotalPrice = pixFinalPrice + pixDiscounts

  const lowestPrice =
    pixFinalPrice > 0 && pixTotalPrice < normalPrice
      ? pixTotalPrice
      : normalPrice

  if (loading) {
    return <Skeleton />
  }

  if (!seller) {
    return null
  }

  return (
    <span className={handles.spotPriceValue}>
      {formatCurrency(lowestPrice)}
    </span>
  )
}
