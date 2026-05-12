/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useProduct, useProductDispatch } from 'vtex.product-context'
import { Item } from 'vtex.product-context/react/ProductTypes'
import { ProductContextState } from 'vtex.product-context/react/ProductContextProvider'
import { pickMaxInstallmentsOptionWithoutInterest } from '../modules/installments'
import { useDevice } from 'vtex.device-detector'
import { SkuItems } from '../types/types'
import { cartSimulationForMultipleItems } from '../../PaymentModal/utils/getMultiplePromotionPrice'
import { formatCurrency } from '../../../utils/pricePix'
//type InstallmentsType = NonNullable<ProductContextState['selectedItem']>['sellers'][number]['commertialOffer']['Installments']

const CSS_HANDLES = ['sku-selector-list-item-discount'] as const

const getPixPrice = (items: any[], sku: Item | null | undefined) => {
  const simulationProductResult = items?.find(item => item?.id === sku?.itemId)

  const price =
    simulationProductResult?.sellingPrice &&
    simulationProductResult?.sellingPrice / 100

  return price
}

function useSKUSelector() {
  const handles = useCssHandles(CSS_HANDLES)
  const contextValue = useProduct()
  const { isMobile } = useDevice()
  const [selectedItems, setSelectedItems] = useState<SkuItems[]>([])
  const prodCtxDispatch = useProductDispatch()
  const [onlyUnavailableItems, setOnlyUnavailableItems] = useState(true)
  const [pixPrices, setPixPrices] = useState<any>([])
  const [currentProduct, setCurrentProduct] = useState<any>({})

  useEffect(() => {
    const hasAvailableQuantity = contextValue?.product?.items?.some(
      item => item.sellers[0].commertialOffer.AvailableQuantity > 0
    )

    setOnlyUnavailableItems(!hasAvailableQuantity)

    // Get pix prices
    if (contextValue?.product?.items?.length) {
      const itemsForSimulation = contextValue.product.items.map(item => ({
        id: item.itemId,
        quantity: 1,
        seller: '1',
      }))

      cartSimulationForMultipleItems(itemsForSimulation, setPixPrices, '125')
    }
  }, [currentProduct])

  useEffect(() => {
    if (
      !contextValue?.product?.productId &&
      contextValue?.product?.productId === currentProduct
    )
      return

    setCurrentProduct(contextValue?.product?.productId)
  }, [contextValue?.product])

  const calcPrice = (sku: ProductContextState['selectedItem']) => {
    const pixPriceSimulationResult = getPixPrice(pixPrices?.items, sku)
    const unitMultiplier = sku?.unitMultiplier ?? 1

    const sellingPrice = sku?.sellers[0].commertialOffer.Price
      ? sku?.sellers[0].commertialOffer.Price * unitMultiplier
      : 0
    const price = pixPriceSimulationResult ?? sellingPrice
    const listPrice = sku?.sellers[0].commertialOffer.ListPrice
      ? sku?.sellers[0].commertialOffer.ListPrice * unitMultiplier
      : 0
    const savingsValue = listPrice && price ? listPrice - price : 1

    const savingsPercentage = (savingsValue * 100) / listPrice

    if (!price || !listPrice) return 0
    if (price && !listPrice) return price

    return Math.round(savingsPercentage)
  }

  const renderSavingsBadge = (skuItem: Item | null | undefined) => {
    const savingDiscount = calcPrice(skuItem)

    return savingDiscount > 0 ? (
      <span className={handles.handles['sku-selector-list-item-discount']}>
        {'-' + calcPrice(skuItem) + '%'}
      </span>
    ) : null
  }

  const installmentsOption = (item: Item) => {
    if (
      !item?.sellers[0]?.commertialOffer?.Installments ||
      item?.sellers[0]?.commertialOffer?.Installments?.length === 0
    ) {
      return null
    }

    return pickMaxInstallmentsOptionWithoutInterest(
      item?.sellers[0]?.commertialOffer?.Installments
    )
  }

  const renderInstallments = (item: Item) => {
    const installments = installmentsOption(item)
    const unitMultiplier = item.unitMultiplier ?? 1
    if (installments != null) {
      const installmentsValueWithUnitMultiplier =
        installments.Value * unitMultiplier
      return `${installments.NumberOfInstallments}x de ${formatCurrency(
        installmentsValueWithUnitMultiplier
      )}`
    } else {
      return null
    }
  }

  const renderPrice = (sku: Item) => {
    const pixPriceSimulationResult = getPixPrice(pixPrices?.items, sku)
    const unitMultiplier = sku.unitMultiplier ?? 1

    const price =
      pixPriceSimulationResult ??
      sku?.sellers[0].commertialOffer.Price * unitMultiplier

    const listPrice = sku?.sellers[0].commertialOffer.ListPrice

    const sellingPriceWithUnitMultiplier = price
    const listPriceWithUnitMultiplier = listPrice * unitMultiplier

    return {
      hasListPrice: listPrice !== price,
      price: `${formatCurrency(sellingPriceWithUnitMultiplier)}`,
      listPrice: `${formatCurrency(listPriceWithUnitMultiplier)}`,
    }
  }

  const handleQuantity = (data: SkuItems) => {
    const index = selectedItems.findIndex(
      (item: { id: number }) => item.id === data.id
    )

    if (index === -1) {
      return setSelectedItems((prevSelectedItems: any[]) =>
        prevSelectedItems.concat(data)
      )
    }

    if (data.quantity === 0) {
      return setSelectedItems((prevSelectedItems: any[]) =>
        prevSelectedItems.filter((item: { id: number }) => item.id !== data.id)
      )
    }

    setSelectedItems((prevSelectedItems: any[]) =>
      prevSelectedItems.map(
        (item: { id: number; quantity: number; seller: any }) => ({
          ...item,
          quantity: item.id === data.id ? data.quantity : item.quantity,
          seller: item.seller || {}, // add a default value for seller
        })
      )
    )
  }

  const handleSelectedItem = (item: Item) => {
    prodCtxDispatch?.({
      type: 'SET_SELECTED_ITEM',
      args: { item },
    })
  }

  return {
    selectedItems,
    contextValue,
    handleQuantity,
    handleSelectedItem,
    renderPrice,
    renderInstallments,
    renderSavingsBadge,
    onlyUnavailableItems,
    isMobile,
  }
}

export default useSKUSelector
