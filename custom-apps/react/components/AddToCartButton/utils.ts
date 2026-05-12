export const operationQuantityItemOnMinicart = (
  operation: 'removeFromCart' | 'addToCart' | 'first-item',
  productQuantity: number,
  productName:string,
  toastTime: number,
  showToast: ({
    duration,
    message,
  }: {
    message: string
    duration: number
  }) => void
) => {
  let operationValue = 0

  if (operation === 'removeFromCart') {
    operationValue = productQuantity - 1

    showToast({
      message: `Produto ${productName} removido do carrinho.`,
      duration: toastTime,
    })
  }

  if (operation === 'addToCart') {
    operationValue = productQuantity + 1

    showToast({
      message: `Produto ${productName} adicionado ao carrinho.`,
      duration: toastTime,
    })
  }

  return operationValue
}
