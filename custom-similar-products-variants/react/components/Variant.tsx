import React from 'react'
import { applyModifiers, useCssHandles } from 'vtex.css-handles'
import { Link, useRuntime } from 'vtex.render-runtime'

import { changeImageUrlSize } from '../utils/imgUrlHelpers'

type LinkPropsType = Omit<React.ComponentProps<typeof Link>, 'children'>

type Props = {
  productId: string | undefined
  productName: string | undefined
  linkText: string | undefined
  srcImage: string | undefined
  specValue: string | undefined
  isAvailable: boolean | undefined
}

const noop = () => { }

const IMG_SIZE = 40

const CSS_HANDLES = ['img__anchor', 'img_wrap', 'img', 'specValue'] as const

const Variant: React.FC<Props> = ({
  productId,
  productName,
  linkText,
  srcImage,
  specValue,
  isAvailable = false,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const {
    route: {
      params: { slug },
    },
  } = useRuntime()

  const isActive = slug === linkText
  const isActiveClass = isActive ? 'isActive' : ''

  const isAvailableClass = isAvailable ? 'available' : 'unavailable'

  const addModifiers = (handlesClass: string) =>
    applyModifiers(handlesClass, [isActiveClass, isAvailableClass])

  const linkProps: LinkPropsType = {
    page: 'store.product',
    params: {
      slug: linkText,
      id: productId,
    },
    className: addModifiers(handles.img__anchor),
    onClick: isActive ? noop : undefined,
  }

  return (
    <Link {...linkProps}>
      <div key={productId} className={addModifiers(handles.img_wrap)}>
        <img
          src={changeImageUrlSize({
            imageUrl: srcImage ?? '',
            width: IMG_SIZE,
            height: IMG_SIZE,
          })}
          alt={productName}
          width={IMG_SIZE}
          height={IMG_SIZE}
          className={addModifiers(handles.img)}
          title={productName}
        />
      </div>
      {specValue ? (
        <span className={addModifiers(handles.specValue)}>{specValue}</span>
      ) : null}
    </Link>
  )
}

export default Variant
