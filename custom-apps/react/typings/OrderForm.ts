interface OrderFormContext {
  orderForm: OrderForm
  loading: boolean
}

interface OrderFormItem {
  additionalInfo: ItemAdditionalInfo
  availability: string
  detailUrl: string
  id: string
  imageUrl: string
  listPrice: number
  measurementUnit: string
  name: string
  price: number
  productId: string
  quantity: number
  seller: string
  sellingPrice: number
  skuName: string
  skuSpecifications: SKUSpecification[]
  uniqueId: string
  productCategories: Record<string, string>
  productCategoryIds: string
  productRefId: string
  refId: string
  parentItemIndex: number | null
}

interface ItemAdditionalInfo {
  brandName: string
}

interface SKUSpecification {
  fieldName: string
  fieldValues: string[]
}

interface OrderForm {
  id: string
  items: OrderFormItem[]
  marketingData: MarketingData
  totalizers: Totalizer[]
  value: number
  messages: OrderFormMessages
  paymentData: PaymentData
}

interface PaymentData {
  installmentOptions: InstallmentOption[]
}

interface InstallmentOption {
  paymentSystem: string
  installments: Installment[]
}

interface Installment {
  count: number
  hasInterestRate: boolean
  total: number
  value: number
}

interface MarketingData {
  coupon: string
}

interface Totalizer {
  id: string
  name: string
  value: number
}

interface OrderFormMessages {
  couponMessages: Message[]
  generalMessages: Message[]
}

interface Message {
  code: string
  status: string
  text: string
}
