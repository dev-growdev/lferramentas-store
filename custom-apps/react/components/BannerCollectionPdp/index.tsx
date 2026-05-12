/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useRef, useEffect, useMemo } from 'react'
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'
import { SliderLayout } from 'vtex.slider-layout'
import { SliderLayoutSiteEditorProps } from 'vtex.slider-layout/react/components/SliderContext'
import { formatIOMessage } from 'vtex.native-types'
import { useIntl } from 'react-intl'
import { usePixel } from 'vtex.pixel-manager'

type Banner = {
  id: string
  desktopImage: string
  mobileImage: string
  isActive: boolean
  link?: string
  analyticsProperties?: 'none' | 'provide'
  promotionId?: string
  promotionName?: string
  promotionPosition?: string
}

type CollectionBanner = {
  collectionId: string
  banners: Banner[]
  isActive: boolean
}

type Props = {
  collectionBanners: CollectionBanner[]
}

const CSS_HANDLES = [
  'bannerContainer',
  'bannerImage',
  'carouselContainer',
] as const

const BannerCollectionPdp = ({ collectionBanners }: Props) => {
  const handles: any = useCssHandles(CSS_HANDLES)
  const productContext = useProduct()
  const intl = useIntl()
  const { push } = usePixel()

  const productCollections = productContext?.product?.productClusters?.map(
    cluster => cluster.id
  )

  const matchingCollection = useMemo(() => {
    return collectionBanners.find(
      collection =>
        collection.isActive &&
        productCollections?.includes(collection.collectionId)
    )
  }, [productCollections, collectionBanners])

  const bannersToDisplay = useMemo(() => {
    return matchingCollection && Array.isArray(matchingCollection.banners)
      ? matchingCollection.banners.filter(banner => banner.isActive)
      : []
  }, [matchingCollection])

  const sliderLayoutProps = {
    itemsPerPage: {
      desktop: 1,
      tablet: 1,
      phone: 1,
    },
    centerMode: {
      desktop: 'disabled',
      tablet: 'disabled',
      phone: 'disabled',
    },
    infinite: true,
    showNavigationArrows: 'desktopOnly',
    showPaginationDots: 'mobileOnly',
    blockClass: 'carousel',
  }

  const containerRef = useRef<HTMLDivElement | null>(null) // Ref para a div principal
  const viewedBanners = useRef<Set<string>>(new Set()) // Track banners que já dispararam o evento

  // Função auxiliar para disparar o evento
  const triggerPromoView = (banner: Banner) => {
    if (
      !banner ||
      viewedBanners.current.has(banner.promotionName!) ||
      banner.analyticsProperties === 'none'
    )
      return

    viewedBanners.current.add(banner.promotionName!) // Marca o banner como visualizado

    const promotionEventData = {
      id: banner.promotionId,
      name: banner.promotionName,
      creative: formatIOMessage({
        id: banner.desktopImage,
        intl,
      }),
      position: banner.promotionPosition,
    }

    push({
      event: 'promoView',
      promotions: [promotionEventData],
    })

    console.log('Disparado:', banner.promotionName)
  }

  useEffect(() => {
    if (!containerRef.current) return

    if (bannersToDisplay.length === 1) {
      triggerPromoView(bannersToDisplay[0])
      return
    }

    // Caso tenha mais de um banner, dispara o primeiro banner diretamente
    if (bannersToDisplay.length > 1) {
      triggerPromoView(bannersToDisplay[0])
    }

    // Configura o MutationObserver para os demais banners
    const observer = new MutationObserver(() => {
      if (!containerRef.current) return

      const visibleBanners = Array.from(
        containerRef.current.querySelectorAll<HTMLDivElement>(
          '[data-banner-id]'
        )
      )

      visibleBanners.forEach(bannerElement => {
        const bannerIndex = parseInt(
          bannerElement.getAttribute('data-banner-index') || '-1',
          10
        )

        if (bannerIndex === -1) return

        const banner = bannersToDisplay[bannerIndex]
        triggerPromoView(banner)
      })
    })

    observer.observe(containerRef.current, {
      childList: true, // Observa mudanças nos filhos
      subtree: true, // Observa mudanças nos descendentes
    })

    return () => {
      observer.disconnect()
    }
  }, [bannersToDisplay, push, intl])

  if (
    !productContext?.product ||
    !collectionBanners ||
    bannersToDisplay.length === 0
  )
    return null

  return (
    <div ref={containerRef} className={handles.bannerContainer}>
      <SliderLayout
        {...(sliderLayoutProps as SliderLayoutSiteEditorProps)}
        className={handles.carouselContainer}
      >
        {bannersToDisplay.map((banner, index) => (
          <div
            key={`${banner.id}+${banner.desktopImage}+${index}`}
            className={handles.carouselContainer}
            data-banner-id={`${banner.promotionName}-${banner.promotionId}`} // Adiciona atributos para identificar os banners
            data-banner-index={index}
            style={{
              width: '100%',
            }}
          >
            {banner.link ? (
              <a
                href={banner.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (banner.analyticsProperties === 'none') {
                    return
                  }

                  const formattedSrc = formatIOMessage({
                    id: banner.desktopImage,
                    intl,
                  })

                  const promotionEventData = {
                    id: banner.promotionId,
                    name: banner.promotionName,
                    creative: formattedSrc,
                    position: banner.promotionPosition,
                  }

                  push({
                    event: 'promotionClick',
                    promotions: [promotionEventData],
                  })
                }}
              >
                <picture>
                  <source
                    srcSet={banner.mobileImage}
                    media="(max-width: 768px)"
                  />
                  <img
                    src={banner.desktopImage}
                    alt="Banner"
                    className={handles.bannerImage}
                  />
                </picture>
              </a>
            ) : (
              <picture>
                <source
                  srcSet={banner.mobileImage}
                  media="(max-width: 768px)"
                />
                <img
                  src={banner.desktopImage}
                  alt="Banner"
                  className={handles.bannerImage}
                />
              </picture>
            )}
          </div>
        ))}
      </SliderLayout>
    </div>
  )
}

BannerCollectionPdp.schema = {
  title: 'Banner por Coleção',
  type: 'object',
  properties: {
    collectionBanners: {
      title: 'Adicionar Banners por Coleção',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          collectionId: {
            title: 'ID da Coleção',
            type: 'string',
          },
          isActive: {
            title: 'Ativar/Desativar Em Toda Coleção',
            type: 'boolean',
            default: true,
          },
          banners: {
            title: 'Adicionar os Banners',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  title: 'Banner ID (Sempre ID da Coleção)',
                  type: 'string',
                },
                desktopImage: {
                  title: 'Carregar Imagem Desktop',
                  type: 'string',
                  widget: {
                    'ui:widget': 'image-uploader',
                  },
                },
                mobileImage: {
                  title: 'Carregar Imagem Desktop Mobile',
                  type: 'string',
                  widget: {
                    'ui:widget': 'image-uploader',
                  },
                },
                link: {
                  title: 'URL do Banner',
                  type: 'string',
                },
                isActive: {
                  title: 'Ativar/Desativar Apenas Este Banner',
                  type: 'boolean',
                  default: true,
                },
                analyticsProperties: {
                  title: 'Evento do Analytics',
                  enum: ['none', 'provide'],
                  enumNames: [
                    'admin/editor.image.analytics.none',
                    'admin/editor.image.analytics.provide',
                  ],
                  widget: {
                    'ui:widget': 'radio',
                  },
                  default: 'none',
                },
              },
              dependencies: {
                analyticsProperties: {
                  oneOf: [
                    {
                      properties: {
                        analyticsProperties: {
                          enum: ['provide'],
                        },
                        promotionId: {
                          title: 'admin/editor.image.analytics.promotionId',
                          type: 'string',
                          default: '',
                        },
                        promotionName: {
                          title: 'admin/editor.image.analytics.promotionName',
                          type: 'string',
                          default: '',
                        },
                        promotionPosition: {
                          title:
                            'admin/editor.image.analytics.promotionPosition',
                          type: 'string',
                          default: '',
                        },
                      },
                    },
                    {
                      properties: {
                        analyticsProperties: {
                          enum: ['none'],
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
}

export default BannerCollectionPdp
