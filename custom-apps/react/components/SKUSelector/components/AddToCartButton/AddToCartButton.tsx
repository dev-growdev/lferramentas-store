import React, { useContext, useState } from 'react'
import { useMutation } from 'react-apollo'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { usePixel } from 'vtex.pixel-manager'
import { ToastContext, ModalDialog } from 'vtex.styleguide'
import type { ToastContextType } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import type { Item } from 'vtex.product-context/react/ProductTypes'

import ADD_ITEM from '../../../../graphql/addItem.gql'
import { mapCartItemToPixel } from '../../utils/pixelHelper'
import useMarketingSessionParams from '../../hooks/useMarketingSessionParams'
import type { SkuItems } from '../../types/types'
import styles from './styles.css'

interface IProps {
  skuItems: SkuItems[]
  items?: Item[]
}

export const AddToCartButton = ({ skuItems, items }: IProps) => {
  const { push } = usePixel()
  const { showToast } = useContext<ToastContextType>(ToastContext)
  const { setOrderForm } = useOrderForm()
  const [loadingAddToCart, setLoadingAddToCart] = useState(false)
  const { utmParams, utmiParams } = useMarketingSessionParams()
  const { deviceInfo } = useRuntime()
  const { isMobile } = deviceInfo
  const dialogRef = React.useRef(null as HTMLDivElement | null)
  const [modalOpen, setModalOpen] = React.useState(false)

  const [addItem] = useMutation<OrderForm, any>(ADD_ITEM, {
    onCompleted: (data: any) => {
      const orderFormData = data?.addToCart

      setOrderForm((prevOrderForm: any) => {
        return {
          ...prevOrderForm,
          ...orderFormData,
        }
      })
      const pixelEventItems = orderFormData?.items?.map(mapCartItemToPixel)

      push({
        id: 'add-to-cart-button',
        event: 'addToCart',
        items: pixelEventItems,
      })
      !isMobile &&
        showToast({
          message: `${
            skuItems.length >= 2
              ? 'Os produtos foram adicionados ao carrinho.'
              : 'Produto foi adicionado ao carrinho.'
          }`,
          duration: 2000,
        })
    },
  })

  const handleAddToCart = () => {
    if (skuItems.length === 0) {
      showToast({
        message: 'Selecione um item para adicionar ao carrinho.',
        duration: 2000,
      })

      return
    }

    setLoadingAddToCart(true)
    setTimeout(() => {
      setLoadingAddToCart(false)
    }, 2000)

    addItem({
      variables: {
        items: skuItems,
        marketingData: { ...utmParams, ...utmiParams },
      },
    })
  }

  return (
    <>
      <button
        className={styles['add-to-cart-btn']}
        onClick={() => {
          if (skuItems.length == 0) handleAddToCart()
          else setModalOpen(true)
        }}
      >
        {loadingAddToCart ? (
          <span className={styles['loading-add-to-cart']} />
        ) : (
          <span className={styles['add-to-cart-btn-label']}>
            Adicionar ao carrinho
          </span>
        )}
      </button>
      <div ref={dialogRef} id="modalConfirmContainer" />
      <ModalDialog
        centered
        container={dialogRef?.current}
        confirmation={{
          onClick: () => {
            handleAddToCart()
            setModalOpen(false)
          },
          label: 'Sim, quero comprar',
        }}
        cancelation={{
          onClick: () => setModalOpen(false),
          label: 'Não, quero voltar',
          testId: 'cancel-button',
        }}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="flex flex-column w-100">
          <p className={`tc b ${styles.modalConfirmTitle}`}>
            Você selecionou o(s) seguinte(s) produto(s):
          </p>
          {skuItems.map(sku => {
            const item = items?.find(item => item.itemId === String(sku.id))

            if (!item) return <></>

            const imageTag = item.images[0].imageTag
              .replace('~', 'https://lfmaquinaseferramentas.vtexassets.com')
              .replace('#width#', '50')
              .replace('#height#', '50')

            return (
              <div
                key={sku?.id}
                className={`flex flex-row flex-auto items-center justify-between ph7 ${styles.modalConfirmProductContainer}`}
              >
                <div
                  className={styles.modalConfirmProductIcon}
                  dangerouslySetInnerHTML={{ __html: imageTag }}
                />
                <div className={`tc gray ${styles.modalConfirmProductName}`}>
                  {item.variations.map(variation => (
                    <span
                      key={variation.values[0]}
                      className={styles.modalConfirmProductVariation}
                    >
                      <span className={styles.modalConfirmProductVariationName}>
                        {variation.name}
                      </span>
                      :{' '}
                      <span
                        className={styles.modalConfirmProductVariationValue}
                      >
                        {variation.values[0]}
                      </span>
                    </span>
                  ))}
                </div>
                <div
                  className={`tc gray ${styles.modalConfirmProductQuantity}`}
                >
                  {sku.quantity * (item?.unitMultiplier ?? 1)} {item.measurementUnit}  
                </div>
              </div>
            )
          })}
          <p className={`tc ${styles.modalConfirmDescription}`}>
            Deseja continuar?
          </p>
        </div>
      </ModalDialog>
    </>
  )
}
