import React, { useEffect } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import {
  pathOr,
  path,
  map,
  sort,
  compose,
  head,
  split,
  length,
  last,
} from 'ramda'
import { useProduct } from 'vtex.product-context'

const ITEM_AVAILABLE = 100

type Seller = any

const lowestPriceInStockSeller = (item: any): Seller | null => {
  if (item.sellers.length) {
    return sort(
      (itemA: any, itemB: any) =>
        itemA.commertialOffer && itemA.commertialOffer.AvailableQuantity > 0
          ? itemB.commertialOffer && itemB.commertialOffer.AvailableQuantity > 0
            ? itemA.commertialOffer.Price - itemB.commertialOffer.Price
            : -1
          : -1,
      item.sellers
    )[0]
  }
  return null
}

const lowestPriceItem = compose(
  head,
  sort(
    (itemA: any, itemB: any) =>
      path(['seller', 'commertialOffer', 'spotPrice'], itemA) -
      path(['seller', 'commertialOffer', 'spotPrice'], itemB)
  )
)

const lowestPriceInStockSKU = (sku: any) => {
  const itemSeller = [
    {
      sku,
      seller: lowestPriceInStockSeller(sku),
    },
  ]
  const { item, seller } = lowestPriceItem(itemSeller) as any

  return {
    item,
    seller,
  }
}

const tryParsingLocale = (description: any, locale: any) => {
  let parsedDescription
  try {
    const descriptionObject = JSON.parse(description)
    parsedDescription =
      descriptionObject[locale] || descriptionObject[head(split('-', locale))]
  } catch (e) {
    console.warn('Failed to parse multilanguage product description')
  }
  return parsedDescription || description
}

const highestPriceItem = compose(
  last,
  sort(
    (itemA: any, itemB: any) =>
      path(['seller', 'commertialOffer', 'Price'], itemA) -
      path(['seller', 'commertialOffer', 'Price'], itemB)
  )
)

const priceItems = (items: any[]) => {
  const lowPrice = lowestPriceItem(items)
  const highPrice = highestPriceItem(items)
  return {
    lowPrice,
    highPrice,
  }
}

const parseSKUToOffer = (item: any, currency: any) => {
  const { seller } = lowestPriceInStockSKU(item)
  const calculateAvailability = (seller: any) => {
    return pathOr(
      ITEM_AVAILABLE,
      ['commertialOffer', 'AvailableQuantity'],
      seller
    )
      ? 'http://schema.org/InStock'
      : 'http://schema.org/OutOfStock'
  }

  const offer = {
    '@type': 'Offer',
    price: path(['commertialOffer', 'Price'], seller),
    priceCurrency: currency,
    availability: calculateAvailability(seller),
    sku: item.itemId,
    itemCondition: 'http://schema.org/NewCondition',
    priceValidUntil: path(['commertialOffer', 'PriceValidUntil'], seller),
    seller: {
      '@type': 'Organization',
      name: seller?.sellerName,
    },
  }

  return offer
}

const composeAggregateOffer = (product: any, currency: any) => {
  const items = map(
    (item: any) => ({
      item,
      seller: lowestPriceInStockSeller(item),
    }),
    product.items
  )

  const { lowPrice, highPrice } = priceItems(items)
  const offersList = map((element: any) => {
    return parseSKUToOffer(element, currency)
  }, product.items)

  const aggregateOffer = {
    '@type': 'AggregateOffer',
    lowPrice: path(['seller', 'commertialOffer', 'spotPrice'], lowPrice),
    highPrice: path(['seller', 'commertialOffer', 'Price'], highPrice),
    price: path(['seller', 'commertialOffer', 'spotPrice'], lowPrice),
    priceCurrency: currency,
    offers: offersList,
    offerCount: length(items),
  }

  return aggregateOffer
}

const parseToJsonLD = (product: any, currency: any, locale: any) => {
  if (!product || !product.items || product.items.length === 0) {
    console.warn('Invalid product data')
    return
  }

  const image = head(path(['items', '0', 'images'], product))
  const brand = product?.brand
  const name = product?.productName
  const description = tryParsingLocale(product?.description ?? '', locale)
  const skuId = product?.items?.[0]?.itemId

  const productLD = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: name,
    brand: brand,
    image: image && image.imageUrl,
    description: description,
    mpn: product.productId,
    sku: skuId,
    offers: composeAggregateOffer(product, currency),
  }

  return JSON.stringify(productLD)
}

function GetProductInfo() {
  const {
    culture: { currency, locale },
  } = useRuntime()
  const productContext = useProduct()
  const product = productContext?.product

  const productLD = parseToJsonLD(product, currency, locale)

  useEffect(() => {
    const script = document.querySelector(
      'script[type="application/ld+json"]:not([data-custom="get-product-info"])'
    )

    if (!script || !script?.innerHTML.includes(`"@type":"Product"`)) return

    try {
      if (Array.from(script?.parentNode?.childNodes ?? []).includes(script)) {
        script?.parentNode?.removeChild(script)
      }
    } catch (e) {
      console.error(e.message)
    }
  }, [product])

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: productLD ?? `` }}
      data-custom="get-product-info"
    />
  )
}

export default GetProductInfo
