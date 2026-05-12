import React from 'react'
import type { PropsWithChildren } from 'react'
import { useDevice } from 'vtex.device-detector'
import { ListContextProvider, useListContext } from 'vtex.list-context'

import { IMAGE_LIST_SCHEMA } from './modules/schema'
import { getImagesAsJSXList } from './modules/imageAsList'
import type { ImagesSchema } from '../../typings/ImageTypes'

export interface ImageListProps {
  images: ImagesSchema
  height?: number
  preload?: boolean
  experimentalPreventLayoutShift?: boolean
}

const isDateValid = (image: ImagesSchema[number]) => {
  const now = new Date()
  let valid = true

  if (image?.enableStartDate && image?.startDate) {
    const startDate = new Date(image.startDate)
    valid = valid && now >= startDate
  }

  if (image?.enableEndDate && image?.endDate) {
    const endDate = new Date(image.endDate)
    valid = valid && now <= endDate
  }

  return valid
}

const filterActiveImages = (images: ImagesSchema) => {
  return images.filter(image => image?.isActive && isDateValid(image))
}

function ImageList({
  images,
  height = 420,
  children,
  preload,
  experimentalPreventLayoutShift,
}: PropsWithChildren<ImageListProps>) {
  const list = useListContext()?.list ?? []
  const { isMobile } = useDevice()

  const activeImages = filterActiveImages(images)

  const imageListContent = getImagesAsJSXList(
    activeImages,
    isMobile,
    height,
    preload,
    experimentalPreventLayoutShift
  )

  const newListContextValue = list.concat(imageListContent)

  return (
    <ListContextProvider list={newListContextValue}>
      {children}
    </ListContextProvider>
  )
}

ImageList.schema = IMAGE_LIST_SCHEMA

export default ImageList
