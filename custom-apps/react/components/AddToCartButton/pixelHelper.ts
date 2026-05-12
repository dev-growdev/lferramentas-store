import type {
  EventName,
  PixelData,
} from 'vtex.pixel-manager/react/PixelEventTypes'

export function mapCartItemToPixel(item: CartItem): PixelCartItem {
  return {
    skuId: item.id,
    variant: item.skuName,
    price: item.sellingPrice,
    priceIsInt: true,
    name: getNameWithoutVariant(item),
    quantity: item.quantity,
    productId: item.productId,
    productRefId: item.productRefId,
    brand: item.additionalInfo ? item.additionalInfo.brandName : '',
    category: productCategory(item),
    detailUrl: item.detailUrl,
    imageUrl: item.imageUrls
      ? fixUrlProtocol(item.imageUrls.at3x)
      : item.imageUrl ?? '',
    referenceId: item.refId,
  }
}

export function mapBuyButtonItemToPixel(item: BuyButtonItem): PixelCartItem {
  // Change this `/Apparel & Accessories/Clothing/Tops/`
  // to this `Apparel & Accessories/Clothing/Tops`
  const category = item.category ? item.category.slice(1, -1) : ''

  return {
    skuId: item.id,
    variant: item.skuName,
    price: item.sellingPrice,
    priceIsInt: true,
    name: item.name,
    quantity: item.quantity,
    productId: item.productId,
    productRefId: item.productRefId,
    brand: item.brand,
    category,
    detailUrl: item.detailUrl,
    imageUrl: item.imageUrl,
    referenceId: item.refId,
  }
}

/**
 * URL comes like "//storecomponents.vteximg.com.br/arquivos/ids/155491"
 * this function guarantees it comes with protocol in it.
 */
function fixUrlProtocol(url: string) {
  if (!url || url.indexOf('http') === 0) {
    return url
  }

  return `https:${url}`
}

/**
 * Remove the variant from the end of the name.
 * Ex: from "Classic Shoes Pink" to "Classic Shoes"
 * Ps: Some products has the name of the variation the same as the item
 */
function getNameWithoutVariant(item: CartItem) {
  if (
    (item?.name && !item.name.includes(item.skuName)) ||
    item.name === item.skuName
  ) {
    return item.name
  }

  const leadingSpace = 1
  const variantLength = leadingSpace + item.skuName.length

  return item.name.slice(0, item.name.length - variantLength)
}

function productCategory(item: CartItem) {
  try {
    const categoryIds = item.productCategoryIds.split('/').filter(c => c.length)
    const category = categoryIds.map(id => item.productCategories[id]).join('/')

    return category
  } catch {
    return ''
  }
}

interface BuyButtonItem {
  id: string
  skuName: string
  sellingPrice: number
  name: string
  quantity: number
  productId: string
  productRefId: string
  brand: string
  category: string
  detailUrl: string
  imageUrl: string
  refId: string
}

export interface PixelCartItem {
  skuId: string
  variant: string
  price: number
  priceIsInt: boolean
  name: string
  quantity: number
  productId: string
  productRefId: string
  brand: string
  category: string
  detailUrl: string
  imageUrl: string
  referenceId: string
}

interface BuyButtonItem {
  id: string
  skuName: string
  sellingPrice: number
  name: string
  quantity: number
  productId: string
  productRefId: string
  brand: string
  category: string
  detailUrl: string
  imageUrl: string
  refId: string
}

export interface CartItem {
  id: string
  skuName: string
  sellingPrice: number
  name: string
  quantity: number
  productId: string
  productRefId: string
  additionalInfo: {
    brandName: string
  }
  productCategoryIds: string
  productCategories: Record<string, string>
  detailUrl: string
  // Field from the usual orderForm API
  imageUrl?: string
  // Field from the order-manager orderForm API
  imageUrls?: {
    at1x: string
    at2x: string
    at3x: string
  }
  refId: string
}

export interface CartItemDataLayer {
  brand: string
  category: string
  id: string
  name: string
  price: number
  quantity: number
  variant: string
}

declare global {
  interface Window {
    dataLayer: any
  }
}

interface DataLayerObject {
  ecommerce?: any
  location?: string
  originalLocation?: string
  originalReferrer?: string
  page?: string
  referrer?: string
  title?: string
  event: string
}

declare global {
  interface Window {
    dataLayer: any
  }
}

interface DataLayerObject {
  ecommerce?: any
  location?: string
  originalLocation?: string
  originalReferrer?: string
  page?: string
  referrer?: string
  title?: string
  event: string
}

export function removesUnpexpectedClickGtm() {
  const dataLayer: any[] = window.dataLayer || []
  const dataLayerLastButOneEvent: DataLayerObject =
    dataLayer[dataLayer.length - 2]

  const dataLayerLastEvent: DataLayerObject = dataLayer[dataLayer.length - 1]

  if (dataLayerLastButOneEvent.event === 'productClick') {
    dataLayer.splice(dataLayer.length - 2, 1)
  }

  if (dataLayerLastEvent.event === 'productClick') {
    dataLayer.pop()
  }
}

export const updateDatalayer = (
  action: EventName,
  productContextValue: any,
  quantityDispatch: number
) => {
  const updateDatalayerObject = (updateDataLayerObject: PixelData) => {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(updateDataLayerObject)
  }

  const productItem = productContextValue?.product?.items[0]
  let productCalculatedPrice = 0

  if (productItem.sellers[0].commertialOffer.ListPrice) {
    productCalculatedPrice = Number(
      (
        productItem.sellers[0].commertialOffer.ListPrice *
        productItem.unitMultiplier
      ).toFixed(2)
    )
  }

  if (productItem.sellers[0].commertialOffer.Price) {
    productCalculatedPrice = Number(
      (
        productItem.sellers[0].commertialOffer.Price *
        productItem.unitMultiplier
      ).toFixed(2)
    )
  }

  const dataLayerObject: CartItemDataLayer = {
    brand: productContextValue?.product?.brand,
    category: productContextValue?.product?.categories[0],
    id: productContextValue?.product?.items[0]?.itemId,
    name: productContextValue?.product?.items[0]?.name,
    price: productCalculatedPrice,
    quantity: Math.abs(quantityDispatch),
    variant: productContextValue?.product?.items[0]?.nameComplete,
  }

  console.log('ecommmerce', dataLayerObject)

  if (action === 'addToCart') {
    updateDatalayerObject({
      event: action,
      ecommerce: { add: { products: [dataLayerObject] } },
    })
  } else if (action === 'removeFromCart') {
    updateDatalayerObject({
      event: action,
      ecommerce: { remove: { products: [dataLayerObject] } },
    })
  }
}
