import React from 'react'
import { applyModifiers, useCssHandles } from 'vtex.css-handles'
import { SliderLayout } from 'vtex.slider-layout'
import CouponCard from './components/couponCard'

interface ICoupon {
  name: string
  discount: string
  discountText: string
  conditionText: string
}

interface ICouponsListProps {
  couponsList: ICoupon[]
  hasSlider?: boolean
}

const CSS_HANDLES = ['couponsList'] as const

function CouponsList({ couponsList, hasSlider = false }: ICouponsListProps) {
  const { handles } = useCssHandles(CSS_HANDLES)


  if (!couponsList || couponsList?.length === 0)
    return <div>Nenhum cupom disponível</div>

  if (hasSlider) {
    return (
      <div className={applyModifiers(handles.couponsList, 'hasSlider')}>
        <SliderLayout
          itemsPerPage={{ phone: 1, tablet: 3, desktop: 3 }}
          blockClass={handles.couponsList}
          showNavigationArrows={false}
          infinite={false}
          autoplay={false}
          centerMode={{
            phone: 'to-the-left',
            desktop: 'disabled',
          }}
          centerModeSlidesGap={16}
        >
          {couponsList.map(coupon => CouponCard({ coupon }))}
        </SliderLayout>
      </div>
    )
  }

  return (
    <ul className={handles.couponsList}>
      {couponsList.map(coupon => CouponCard({ coupon }))}
    </ul>
  )
}

CouponsList.defaultProps = {
  couponsList: [
    {
      name: 'LF15',
      discount: '15,00',
      discountText: '**DE DESCONTO** \n NA PRIMEIRA COMPRA',
      conditionText:
        '*Válido para compras acima de \n R$ 399 em TODO SITE e somente para uma utilização por CPF.',
    },
    {
      name: 'LF50',
      discount: '50,00',
      discountText: '**DE DESCONTO** \n NA PRIMEIRA COMPRA',
      conditionText:
        '*Válido para compras acima de \n R$ 999 em TODO SITE e somente para uma utilização por CPF.',
    },
    {
      name: 'LF100',
      discount: '100,00',
      discountText: '**DE DESCONTO** \n NA PRIMEIRA COMPRA',
      conditionText:
        '*Válido para compras acima de \n R$ 1.999 em TODO SITE e somente para uma utilização por CPF.',
    },
  ],
}

CouponsList.schema = {
  title: 'Lista de Cupons',
  type: 'object',
  properties: {
    couponsList: {
      type: 'array',
      title: 'Cupons',
      items: {
        type: 'object',
        title: 'Cupom',
        default: CouponsList.defaultProps.couponsList,
        properties: {
          name: {
            type: 'string',
            title: 'Nome do Cupom',
            default: 'Nome do Cupom',
          },
          discount: {
            type: 'string',
            title: 'Valor do Desconto (formato: xx,xx)',
            default: '15,00',
          },
          discountText: {
            type: 'string',
            title: 'Frase de Desconto',
            default: 'DE DESCONTO \n NA PRIMEIRA COMPRA',
            widget: {
              'ui:widget': 'textarea',
            },
          },
          conditionText: {
            type: 'string',
            title: 'Frase de Condição',
            default:
              '*Válido para compras acima de R$ 399 em TODO SITE e somente para uma utilização por CPF.',
            widget: {
              'ui:widget': 'textarea',
            },
          },
        },
      },
    },
  },
}

export default CouponsList
