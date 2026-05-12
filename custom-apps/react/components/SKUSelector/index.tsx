/* eslint-disable*/
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Item } from 'vtex.product-context/react/ProductTypes'
import { QuantityStepper } from './components/QuantityStepper/QuantityStepper'
import { AddToCartButton } from './components/AddToCartButton/AddToCartButton'
import useSKUSelector from './hooks/useSKUSelector'

//type InstallmentsType = NonNullable<ProductContextState['selectedItem']>['sellers'][number]['commertialOffer']['Installments']

const CSS_HANDLES = [
  'sku-selector-list',
  'sku-selector-list-item',
  'sku-selector-list-item-selected',
  'sku-selector-list-item-name',
  'sku-selector-list-item-installments',
  'sku-selector-list-item-discount',
  'sku-selector-list-price',
  'sku-selector-price',
  'sku-selector-price-wrapper', 
  'sku-selector-price-container',
] as const

function SKUSelector() {
  const handles = useCssHandles(CSS_HANDLES)
  const {
    selectedItems,
    contextValue,
    handleQuantity,
    handleSelectedItem,
    renderPrice, 
    renderInstallments,
    renderSavingsBadge,
    onlyUnavailableItems,
    isMobile,
  } = useSKUSelector()

  if (onlyUnavailableItems) return null

  return (
    <>
      <ul className={handles.handles['sku-selector-list']}>
        {contextValue?.product?.items?.map((item: Item) => {

          return (
            <>
              <li
                key={`sku-selector-${item?.itemId}`}
                className={
                  item?.itemId == contextValue?.selectedItem?.itemId
                    ? handles.handles['sku-selector-list-item'] +
                      ' ' +
                      handles.handles['sku-selector-list-item-selected']
                    : handles.handles['sku-selector-list-item']
                }
                onClick={() => handleSelectedItem(item)}
              >
                <span
                  className={handles.handles['sku-selector-list-item-name']}
                >
                  {item?.name}
                </span>
                <div
                  className={handles.handles['sku-selector-price-container']}
                >
                  {item.sellers[0].commertialOffer.AvailableQuantity <= 0 ? (
                    <></>
                  ) : (
                    <span
                      className={handles.handles['sku-selector-price-wrapper']}
                    >
                      {renderPrice(item).hasListPrice && (
                        <span
                          className={handles.handles['sku-selector-list-price']}
                        >
                          {renderPrice(item).listPrice}
                        </span>
                      )}
                      {isMobile && renderSavingsBadge(item)}
                      <span className={handles.handles['sku-selector-price']}>
                        <strong>{renderPrice(item).price}</strong> à vista 
                      </span>
                    </span>
                  )}
                  {renderInstallments(item) != null && (
                    <span
                      className={
                        handles.handles['sku-selector-list-item-installments']
                      }
                    >
                      Ou <strong>{renderInstallments(item)}</strong>
                    </span>
                  )}
                </div>
                {!isMobile && renderSavingsBadge(item)}
                <QuantityStepper
                  handleQuantity={handleQuantity}
                  availableQuantity={
                    item.sellers[0].commertialOffer.AvailableQuantity
                  }
                  id={item.itemId}
                  seller={item.sellers[0].sellerId}
                  unit={item.measurementUnit}
                  unitMultiplier={item.unitMultiplier}
                />
              </li>
            </>
          )
        })}
      </ul>
      <AddToCartButton
        skuItems={selectedItems}
        items={contextValue?.product?.items}
      />
    </>
  ) 
}

export default SKUSelector
