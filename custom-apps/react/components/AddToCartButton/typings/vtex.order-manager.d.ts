declare module 'vtex.order-manager/OrderForm' {
  export type OrderFormType = {
    orderForm: {
      items: Array<{
        productId: string
        quantity: number
      }>
    }
    setOrderForm: (prevOrderForm: any) => any
  }
  export const useOrderForm = () => <OrderFormType>
}

declare module 'vtex.order-manager'
