import React from 'react'
import { canUseDOM } from 'vtex.render-runtime'
import { useProduct } from 'vtex.product-context'
import { ModalDialog, Button, ToastContext } from 'vtex.styleguide'
import type { ToastContextType } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import { QueryProductRecommendations } from 'vtex.store-resources'
import type {
  QueryProductRecommendationsArgs,
  Product,
} from 'vtex.store-graphql'

import styles from './styles.css'

type QueryProductRecommendationsData = {
  productRecommendations: Product[]
}

export default function ModalConfirmBuy() {
  const { showToast } = React.useContext<ToastContextType>(ToastContext)
  const productCtx = useProduct()
  const buyButtonRef = React.useRef(null as HTMLButtonElement | null)
  const fakeBuyButtonRef = React.useRef(null as HTMLButtonElement | null)
  const dialogRef = React.useRef(null as HTMLDivElement | null)
  const inputQuantityref = React.useRef(null as HTMLInputElement | null)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const { data, loading, error } = useQuery<
    QueryProductRecommendationsData,
    QueryProductRecommendationsArgs
  >(QueryProductRecommendations, {
    variables: {
      identifier: { field: 'id', value: productCtx?.product?.productId ?? '' },
      type: `similars`,
    },
    fetchPolicy: 'no-cache',
    ssr: true,
    skip: !productCtx?.product?.productId,
  })
  const variations = productCtx?.selectedItem?.variations || []

  const imageTag = productCtx?.selectedItem?.images[0].imageTag
    .replace('~', 'https://lfmaquinaseferramentas.vtexassets.com')
    .replace('#width#', '64')
    .replace('#height#', '64')

  React.useEffect(() => {
    if (canUseDOM) {
      const inputQuantity = document.querySelector(
        '.vtex-flex-layout-0-x-flexColChild--container__product-quantity .vtex-numeric-stepper__input'
      ) as HTMLInputElement | null
      if (inputQuantity) {
        inputQuantityref.current = inputQuantity
      }

      const modalContainer = document.createElement('div')
      modalContainer.setAttribute('id', 'modalConfirmContainer')
      dialogRef.current = modalContainer
      document.body.appendChild(modalContainer)
    }
    function onResizeWindow() {
      const tooltip: HTMLDivElement | null = document.querySelector(
        "div[role='tooltip']"
      )
      if (tooltip) {
        tooltip.classList.add('o-0')
        tooltip.classList.add('dn')
      }
    }
    window.addEventListener('resize', onResizeWindow)
    return () => {
      window.removeEventListener('resize', onResizeWindow)
    }
  }, [canUseDOM])

  React.useEffect(() => {
    if (canUseDOM) {
      const buybutton = document.querySelector(
        '#buy-button-pdp .vtex-button'
      ) as HTMLButtonElement | null

      if (buybutton) {
        buyButtonRef.current = buybutton
      }
    }
  }, [canUseDOM, productCtx])

  function handleClickBuyButton() {
    if (productCtx?.skuSelector?.areAllVariationsSelected) {
      setIsLoading(true)
      buyButtonRef.current?.click()
      setTimeout(() => setIsLoading(false), 1000)
    } else {
      const tooltip: HTMLDivElement | null = document.querySelector(
        "div[role='tooltip']"
      )

      if (tooltip && fakeBuyButtonRef.current) {
        tooltip.classList.remove('o-0')
        tooltip.classList.remove('dn')
        const buyButtonTop =
          fakeBuyButtonRef.current.offsetTop -
          tooltip.getBoundingClientRect().height -
          10
        const buyButtonLeft =
          fakeBuyButtonRef.current.offsetLeft +
          (fakeBuyButtonRef.current.getBoundingClientRect().width -
            tooltip.getBoundingClientRect().width) /
            2
        tooltip.style.transform = `translate3d(${buyButtonLeft}px, ${buyButtonTop}px, 0px)`
      } else {
        showToast({
          message: 'Selecione um item para adicionar ao carrinho.',
          duration: 2000,
        })
      }
    }
  }

  function getColorByName() {
    const colorName = productCtx?.product?.productName.split(' ')
    if (!colorName) return ''
    data?.productRecommendations.forEach(item => {
      item.productName?.split(' ').some((word: string, index: number) => {
        const currentProductName = productCtx?.product?.productName.split(' ')
        if (!currentProductName) return false
        if (word == currentProductName[index]) {
          colorName[index] = ''
          return false
        } else colorName[index] = currentProductName[index]
        return true
      })
    })

    return colorName?.join(' ').trim() || ''
  }

  if (Number(data?.productRecommendations.length) > 0) {
    const colorName = getColorByName()
    if (colorName && !variations.some(v => v.name.toLowerCase() == 'cor'))
      variations.push({ name: 'Cor', values: [colorName] })
  }

  return (
    <>
      <Button
        ref={fakeBuyButtonRef}
        id="buy-button-custom"
        testId="buy-button-custom"
        isLoading={loading || isLoading}
        onClick={() => {
          if (
            (!error && !loading && data?.productRecommendations[0]) ||
            (Number(productCtx?.product?.items.length) > 1 &&
              productCtx?.skuSelector?.areAllVariationsSelected)
          )
            setModalOpen(true)
          else handleClickBuyButton()
        }}
      >
        <span className="vtex-add-to-cart-button-0-x-buttonText">
          Adicionar ao carrinho
        </span>
      </Button>
      <ModalDialog
        centered
        container={dialogRef?.current}
        confirmation={{
          onClick: () => {
            handleClickBuyButton()
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
            Você selecionou o seguinte produto:
          </p>
          <div
            className={`flex flex-row flex-auto items-center justify-between ph7 ${styles.modalConfirmProductContainer}`}
          >
            <div
              className={styles.modalConfirmProductIcon}
              dangerouslySetInnerHTML={{ __html: imageTag || '' }}
            />
            <div className={`tc gray ${styles.modalConfirmProductName}`}>
              {variations.map(variation => (
                <span
                  key={variation.name}
                  className={styles.modalConfirmProductVariation}
                >
                  <span className={styles.modalConfirmProductVariationName}>
                    {variation.name}
                  </span>
                  :{' '}
                  <span className={styles.modalConfirmProductVariationValue}>
                    {variation.values[0]}
                  </span>
                </span>
              ))}
            </div>
            <div className={`tc gray ${styles.modalConfirmProductQuantity}`}>
              {inputQuantityref.current?.value}{' '}
              {productCtx?.selectedItem?.measurementUnit}
            </div>
          </div>
          <p className={`tc ${styles.modalConfirmDescription}`}>
            Deseja continuar?
          </p>
        </div>
      </ModalDialog>
    </>
  )
}
