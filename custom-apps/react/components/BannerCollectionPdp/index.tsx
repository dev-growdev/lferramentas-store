/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useRef, useEffect, useMemo, useState } from 'react'
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
  startDate?: string
  endDate?: string
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

const parseDate = (value?: string) => {
  if (!value) return null
  const date = new Date(value)
  return isNaN(date.getTime()) ? null : date
}

const isScheduled = (banner: Banner) =>
  !!parseDate(banner.startDate) || !!parseDate(banner.endDate)

const isWithinSchedule = (banner: Banner, now: Date | null) => {
  if (!isScheduled(banner)) return true
  if (!now) return false
  const start = parseDate(banner.startDate)
  const end = parseDate(banner.endDate)
  if (start && now < start) return false
  if (end && now > end) return false
  return true
}

const BannerCollectionPdp = ({ collectionBanners }: Props) => {
  const handles: any = useCssHandles(CSS_HANDLES)
  const productContext = useProduct()
  const intl = useIntl()
  const { push } = usePixel()

  // Banners agendados só são avaliados no navegador, para não depender do cache do SSR
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
  }, [])

  const productClusters = productContext?.product?.productClusters

  const productCollections = useMemo(
    () => productClusters?.map(cluster => cluster.id),
    [productClusters]
  )

  const matchingBanners = useMemo(() => {
    return (collectionBanners ?? [])
      .filter(
        collection =>
          collection.isActive &&
          productCollections?.includes(collection.collectionId) &&
          Array.isArray(collection.banners)
      )
      .reduce<Banner[]>(
        (banners, collection) => banners.concat(collection.banners),
        []
      )
  }, [productCollections, collectionBanners])

  const bannersToDisplay = useMemo(() => {
    return matchingBanners.filter(
      banner => banner.isActive && isWithinSchedule(banner, now)
    )
  }, [matchingBanners, now])

  const hasMultipleBanners = bannersToDisplay.length > 1

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
    showNavigationArrows: hasMultipleBanners ? 'desktopOnly' : 'never',
    showPaginationDots: hasMultipleBanners ? 'always' : 'never',
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
            key={`${banner.id}-${index}`}
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
                startDate: {
                  title: 'Exibir a partir de',
                  description:
                    'Data e hora de início da exibição do banner. Deixe vazio para exibir imediatamente.',
                  type: 'string',
                  format: 'date-time',
                  widget: {
                    'ui:widget': 'datetime',
                  },
                },
                endDate: {
                  title: 'Expirar em',
                  description:
                    'Data e hora em que o banner deixará de ser exibido. Deixe vazio para não expirar.',
                  type: 'string',
                  format: 'date-time',
                  widget: {
                    'ui:widget': 'datetime',
                  },
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
