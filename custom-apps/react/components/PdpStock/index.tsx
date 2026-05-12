import React from "react"
import { useProduct } from "vtex.product-context"
import { DataBar } from "./Items"
const PdpStock = (qtdMin: TypePdpStock) => {

  const selectedItem = useProduct()
  const quantidade = selectedItem?.selectedItem?.sellers[0].commertialOffer.AvailableQuantity || 0

  const quantityDefault = qtdMin.quantidade || 10

  return (
    <>
      {
        quantidade < quantityDefault ?
          <DataBar /> : ''
      }
    </>
  )
}
export default PdpStock

PdpStock.schema = {
  title: 'Estoque da PDP',
  type: 'object',
  properties: {
    quantidade: {
      type: 'number',
      title: 'Quantidade Minima',
      default: 10
    }
  }
}
