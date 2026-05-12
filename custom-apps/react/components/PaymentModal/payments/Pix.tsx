import React from 'react'
import useProduct from 'vtex.product-context/useProduct'
import style from './style.css'
import pixSteps from './pix-steps.png'
import { cartSimulation } from '../utils/getPromotionPrice'
import { ProductContextState } from 'vtex.product-context/react/ProductTypes'
import { formatCurrency } from '../../../utils/pricePix'

export default function Pix() {
  const { selectedItem }: ProductContextState = useProduct()
  const [price, setPrice] = React.useState<number>()

  React.useEffect(() => {
    const pixId = '125'
    if (selectedItem) {
      cartSimulation(selectedItem, setPrice, pixId)
    }
  }, [selectedItem])

  const priceFormatted = (price: number | undefined) => {
    if (price === undefined) return
    return `R$ ${(price / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const calculateDiscount = (price: number | undefined) => {
    const listPrice = selectedItem?.sellers[0].commertialOffer.ListPrice
    if (
      price === undefined ||
      listPrice === undefined ||
      price / 100 >= listPrice
    )
      return null
    return formatCurrency(listPrice - price / 100)
  }

  return (
    <div className={style.tabContent + ' ' + style.containerPix}>
      <div className={style.tabWrapper}>
        <span className={style.textPriceBoleto}>
          {price && <>{priceFormatted(price)} à vista no PIX</>}
        </span>
        {price && calculateDiscount(price) && (
          <span className={style.textDesconto}>
            (Economize {calculateDiscount(price)})
          </span>
        )}
      </div>
      <div>
        <img src={pixSteps} className={style.pixSteps} alt="" />
      </div>
    </div>
  )
}
