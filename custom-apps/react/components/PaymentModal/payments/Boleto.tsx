import React from 'react'
import useProduct from 'vtex.product-context/useProduct'
import style from './style.css'
import { cartSimulation } from '../utils/getPromotionPrice'
import { ProductContextState } from 'vtex.product-context/react/ProductTypes'
import { formatCurrency } from '../../../utils/pricePix'

const Boleto = () => {
  const { selectedItem }: ProductContextState = useProduct()
  const [price, setPrice] = React.useState<number>()

  React.useEffect(() => {
    const boletoId = '6'
    if (selectedItem) {
      cartSimulation(selectedItem, setPrice, boletoId)
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
    <>
      <div className={style.tabContent}>
        <div className={style.tabWrapper}>
          <span className={style.textPriceBoleto}>
            {price && <>{priceFormatted(price)} à vista no boleto </>}
          </span>
          {price && calculateDiscount(price) && (
            <span className={style.textDesconto}>
              (Economize {calculateDiscount(price)})
            </span>
          )}
        </div>
        <div className={style.mt2 + ' ' + style.Boleto}>
          O boleto será gerado após a finalização de sua compra. Imprima e pague
          no banco ou pague na internet utilizando o código de barras do boleto
        </div>

        <div className={style.mt2 + ' ' + style.Boleto}>
          O prazo de entrega é válido a partir da data de compensação do boleto.
          Pagamento somente à vista. O boleto não será enviado para o seu
          endereço físico.
        </div>
      </div>
    </>
  )
}

export default Boleto
