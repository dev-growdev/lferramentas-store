import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'shop-by-brand--container',
  'shop-by-brand--card',
  'shop-by-brand--name',
  'shop-by-brand--image',
  'shop-by-brand--url',
  'shop-by-brand--show-more',
  'shop-by-brand--show-more-text',
  'shop-by-brand--show-more-progress',
  'shop-by-brand--show-more-button',
] as const

interface IShopByBrand {
  brands: {
    name: string
    image: string
    url: string
  }[]
}

export const ShopByBrand = ({ brands }: IShopByBrand) => {
  const [maxVisibleBrands, setMaxVisibleBrands] = useState(36)
  const { handles } = useCssHandles(CSS_HANDLES)

  if (!brands?.length) return null

  const filteredBrands = brands.filter((_, index) => {
    return index < maxVisibleBrands
  })

  return (
    <>
      <main className={handles['shop-by-brand--container']}>
        {filteredBrands.map(brand => (
          <div key={brand.name} className={handles['shop-by-brand--card']}>
            <a href={brand.url} className={handles['shop-by-brand--url']}>
              <img
                src={brand.image}
                alt={brand.name}
                className={handles['shop-by-brand--image']}
                width={190}
                height={103}
              />
              <p className={handles['shop-by-brand--name']}>Ver produtos</p>
            </a>
          </div>
        ))}
      </main>
      <div className={handles['shop-by-brand--show-more']}>
        <p className={handles['shop-by-brand--show-more-text']}>
          Mostrando{' '}
          <strong>
            {maxVisibleBrands >= brands.length
              ? brands.length
              : maxVisibleBrands}{' '}
            de {brands.length}
          </strong>
        </p>
        <div className={handles['shop-by-brand--show-more-progress']}>
          <span
            style={{
              width: (maxVisibleBrands / brands.length) * 100 + '%',
              maxWidth: '100%',
              display: 'block',
              height: '100%',
              background: '#FFE72E',
            }}
          ></span>
        </div>
        {brands.length > maxVisibleBrands && (
          <button
            onClick={() => setMaxVisibleBrands(maxVisibleBrands + 36)}
            className={handles['shop-by-brand--show-more-button']}
          >
            Carregar mais marcas
          </button>
        )}
      </div>
    </>
  )
}

ShopByBrand.schema = {
  title: 'Configurações das Marcas',
  type: 'object',
  properties: {
    brands: {
      type: 'array',
      title: 'Configurar Lista de Marcas',
      items: {
        type: 'object',
        title: 'Marca',
        properties: {
          name: {
            type: 'string',
            title: 'Nome da Marca',
            default: 'Nome da Marca',
          },
          image: {
            type: 'string',
            title: 'Imagem da Marca',
            default: 'Imagem da Marca',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          url: {
            type: 'string',
            title: 'Url da Marca',
            default: 'Url da Marca',
          },
        },
      },
    },
  },
}
