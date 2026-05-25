/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useItemContext } from 'vtex.product-list/ItemContext'
import { useCssHandles } from 'vtex.css-handles'

import { cartSimulation } from '../PaymentModal/utils/getPromotionPrice'

const HANDLES = [
  'custom-minicart-list-price',
  'custom-minicart-spot-price',
  'custom-minicart-selling-price',
]

const priceFormatted = (price: number | undefined, unitMultiplier = 1) => {
  if (price === undefined) return

  const newPrice = price * unitMultiplier

  return `R$ ${(newPrice / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const CustomMinicartPrice = React.memo(() => {
  const { item } = useItemContext()
  const [price, setPrice] = useState<number>()
  const { handles } = useCssHandles(HANDLES)

  const unitMultiplier = item?.unitMultiplier ?? 1
  const quantity = item?.quantity ?? 1
  const sellingPrice = item?.sellingPrice * quantity
  const pixTotalPrice = price !== undefined ? price * unitMultiplier * quantity : undefined

  const hasPixDiscount =
    pixTotalPrice !== undefined &&
    pixTotalPrice > 0 &&
    pixTotalPrice < sellingPrice

  useEffect(() => {
    const pixId = '125'
    if (item) {
      cartSimulation(item, setPrice, pixId, quantity)
    }
  }, [item?.id, quantity])

  return (
    <div>
      {hasPixDiscount && (
        <>
          <div className={handles['custom-minicart-spot-price']}>
            {priceFormatted(price, unitMultiplier)} <span> ou</span>
          </div>
          <div className={handles['custom-minicart-selling-price']}>
            {priceFormatted(sellingPrice)} a prazo
          </div>
        </>
      )}
      {!hasPixDiscount && (
        <div className={handles['custom-minicart-spot-price']}>
          {priceFormatted(sellingPrice)}
        </div>
      )}
    </div>
  )
})

export default CustomMinicartPrice