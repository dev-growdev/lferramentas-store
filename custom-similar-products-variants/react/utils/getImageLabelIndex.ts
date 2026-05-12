import type { Product } from 'vtex.store-graphql'

type Items = NonNullable<NonNullable<Product>['items']>
type Item = NonNullable<Items[number]>
type Imgs = Item['images']

const getImageLabelIndex = (images: Imgs, imageLabel: string | undefined) => {
  if (imageLabel === undefined) return 0

  const labelMatchIndex =
    images?.findIndex((img: any) => img?.imageLabel === imageLabel) ?? -1

  const noMatch = labelMatchIndex < 0

  if (noMatch) return 0

  return labelMatchIndex
}

export default getImageLabelIndex
