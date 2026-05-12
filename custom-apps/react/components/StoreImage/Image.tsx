import React, { Fragment, useState, useRef, useEffect } from 'react'
import type { ImgHTMLAttributes, RefObject } from 'react'
import { useOnView } from 'vtex.on-view'
// import type { CustomClasses } from '../../typings/CssHandlesTypes'
import { useIntl, defineMessages } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'
import { Link } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager'
import type { CssHandlesTypes } from 'vtex.css-handles'
import type { ImageSchema } from '../../typings/ImageTypes'
import { useCssHandles } from 'vtex.css-handles'
import './styles.css'
import LazyComponent from '../LazyComponent/LazyComponent'
import { Helmet } from 'vtex.render-runtime'

const CSS_HANDLES = ['imageElement', 'imageElementLink'] as const

export interface ImageProps
  extends ImageSchema,
    ImgHTMLAttributes<HTMLImageElement> {
  maxWidth?: string | number
  maxHeight?: string | number
  minWidth?: string | number
  minHeight?: string | number
  blockClass?: string
  experimentalPreventLayoutShift?: boolean
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
  preload?: boolean
  loading?: 'eager' | 'lazy'
  /**
   * Warning: This property is for internal usage, please avoid using it.
   * This property is used when the Image is children of the SliderTrack component and it prevents triggering the promoView event twice for cloned images.
   * https://github.com/vtex-apps/slider-layout/blob/master/react/components/SliderTrack.tsx
   */
  __isDuplicated?: boolean
}

const useImageLoad = (
  imageRef: RefObject<HTMLImageElement | null>,
  { bailOut = false } = {}
) => {
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    if (bailOut) {
      return
    }

    const imageElement = imageRef.current

    if (!imageElement) {
      return
    }

    if (imageElement.complete) {
      setLoaded(true)

      return
    }

    const handleLoad = () => {
      setLoaded(true)
    }

    imageElement.addEventListener('load', handleLoad)

    return () => {
      imageElement.removeEventListener('load', handleLoad)
    }
  }, [imageRef, bailOut])

  return isLoaded
}

function ImageCustom(props: ImageProps) {
  const {
    src,
    alt = '',
    // maxWidth,
    maxHeight,
    minWidth,
    minHeight,
    width,
    height,
    srcSet = '',
    sizes = '',
    link,
    title,
    experimentalPreventLayoutShift,
    analyticsProperties = 'none',
    promotionId,
    promotionName,
    promotionPosition,
    preload,
    classes,
    loading = 'eager',
    // eslint-disable-next-line
    __isDuplicated,
  } = props

  const imageRef = useRef<HTMLImageElement | null>(null)
  const isLoaded = useImageLoad(imageRef, {
    bailOut: !experimentalPreventLayoutShift,
  })

  const intl = useIntl()

  const { handles } = useCssHandles(CSS_HANDLES, {
    migrationFrom: 'vtex.store-components@3.x',
    classes,
  })
  // const imageDimensions = {
  //   minWidth,
  //   minHeight,
  //   maxWidth,
  //   maxHeight,
  //   width,
  //   height,
  // }

  const placeholderSize = height ?? minHeight ?? maxHeight ?? 'auto'

  const formattedSrc = formatIOMessage({ id: src, intl })
  const formattedAlt = formatIOMessage({ id: alt, intl })

  const [newWidth, setNewWidth] = useState(height ?? minHeight ?? 0)
  const [newHeight, setNewHeight] = useState(width ?? minWidth ?? 0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) {
      setIsLoading(false)
    }
    const setImageSize = () => {
      if (src) {
        const img = new Image()
        if (img) {
          img.src = src
          img.onload = () => {
            setNewWidth(img.width)
            setNewHeight(img.height)
          }
        }
        return
      }

      if (srcSet) {
        const img = new Image()
        if (img) {
          img.srcset = srcSet
          img.onload = () => {
            setNewWidth(img.width)
            setNewHeight(img.height)
          }
        }
      }
    }

    setImageSize()
  }, [isLoaded, src])

  const onlyNumbersHeight =
    typeof height === 'string' ? height.replace(/\D/g, '') : height

  const onlyNumbersWidth =
    typeof width === 'string' ? width.replace(/\D/g, '') : width

  const imgElement =
    loading === 'lazy' && isLoading && height && width ? (
      <LazyComponent
        height={Number(onlyNumbersHeight)}
        width={Number(onlyNumbersWidth)}
      />
    ) : (
      <>
        {preload && typeof formattedSrc === 'string' ? (
          <Helmet>
            <link rel="preload" href={formattedSrc} as="image" />
          </Helmet>
        ) : (
          <></>
        )}
        <img
          title={title}
          sizes={sizes}
          srcSet={srcSet}
          src={typeof formattedSrc === 'string' ? formattedSrc : ''}
          alt={typeof formattedAlt === 'string' ? formattedAlt : ''}
          height={height ?? newHeight}
          width={width ?? newWidth}
          ref={imageRef}
          className={handles.imageElement}
          loading={loading}
          {...(preload
            ? {
                'data-vtex-preload': 'true',
              }
            : {})}
        />
      </>
    )

  /**
   * To understand why we need to check for both newTab and openNewTab
   * properties, check the Image type definition at './typings/image.d.ts'.
   */
  const shouldOpenLinkInNewTab = link?.newTab ?? link?.openNewTab

  const { push } = usePixel()

  const promotionEventData =
    analyticsProperties === 'provide'
      ? {
          id: promotionId,
          name: promotionName,
          creative: formattedSrc,
          position: promotionPosition,
        }
      : undefined

  const formattedLink = formatIOMessage({ id: link?.url, intl })
  const formattedTitle = formatIOMessage({ id: link?.attributeTitle, intl })

  const maybeLink = link?.url ? (
    // The onClick function and the <Link> component are necessary,
    // knowing this, it seems good to disable the anchor-is-valid rule.
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link
      to={typeof formattedLink === 'string' ? formattedLink : ''}
      title={typeof formattedTitle === 'string' ? formattedTitle : 'Link'}
      rel={link.attributeNofollow ? 'nofollow' : ''}
      target={shouldOpenLinkInNewTab ? '_blank' : undefined}
      className={handles.imageElementLink}
      onClick={() => {
        if (analyticsProperties === 'none') return

        push({ event: 'promotionClick', promotions: [promotionEventData] })
      }}
    >
      {imgElement}
    </Link>
  ) : (
    <Fragment>{imgElement}</Fragment>
  )

  useOnView({
    ref: imageRef,
    onView: () => {
      if (analyticsProperties === 'none' || __isDuplicated) return

      push({
        event: 'promoView',
        promotions: [promotionEventData],
      })
    },
    once: true,
  })

  return experimentalPreventLayoutShift ? (
    <span
      className="dib"
      style={{
        height: isLoaded ? 'auto' : placeholderSize,
      }}
    >
      {maybeLink}
    </span>
  ) : (
    maybeLink
  )
}

const messages = defineMessages({
  title: {
    id: 'admin/editor.store-image.title',
  },
})

ImageCustom.schema = {
  title: messages.title.id,
}

ImageCustom.cssHandles = CSS_HANDLES

export default ImageCustom
