import React, { useEffect, useState } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCssHandles } from 'vtex.css-handles'
import { index as RichText } from 'vtex.rich-text'

interface ICoupon {
  name: string
  discount: string
  discountText: string
  conditionText: string
}

interface IOrderForm {
  orderForm: OrderForm
  setOrderForm: React.Dispatch<React.SetStateAction<OrderForm>>
}

const CSS_HANDLES = [
  'couponCard',
  'couponName',
  'couponDiscount',
  'couponDiscountInteger',
  'couponDiscountDecimal',
  'couponDiscountText',
  'couponCopy',
  'couponCopyArea',
  'couponCopyText',
  'couponCopyName',
  'couponCopyHover',
  'couponApplied',
  'couponConditionText',
] as const

const formatCurrencyStyle = (price: string) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  const integers = price.split(',')[0]
  const decimals = price.split(',')[1]

  return (
    <>
      R$
      <span className={handles.couponDiscountInteger}>{integers}</span>,
      <span className={handles.couponDiscountDecimal}>{decimals}</span>
    </>
  )
}

function CouponCard({ coupon }: { coupon: ICoupon }) {
  const [hasAppliedCoupon, setHasAppliedCoupon] = useState(false)
  const { orderForm, setOrderForm }: IOrderForm = useOrderForm()
  const { handles } = useCssHandles(CSS_HANDLES)

  const applyCoupon = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: coupon.name }),
    }

    try {
      const response = await fetch(
        `/api/checkout/pub/orderForm/${orderForm.id}/coupons`,
        options
      )

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const responseFormatted = await response.json()

      const itemsSellingPrice = responseFormatted.items.map((item: any) => {
        return { sellingPrice: item.sellingPrice }
      })
      const items = orderForm.items.map((item, index) => {
        return { ...item, ...itemsSellingPrice[index] }
      })

      const newOrderForm = {
        ...orderForm,
        marketingData: responseFormatted.marketingData,
        totalizers: responseFormatted.totalizers,
        items,
      }

      setOrderForm(newOrderForm)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const hasApplied = orderForm?.marketingData?.coupon == coupon.name
    setHasAppliedCoupon(hasApplied)
  }, [orderForm, coupon])

  return (
    <li className={handles.couponCard} key={coupon.name}>
      <h3 className={handles.couponName}>{coupon.name}</h3>
      <p className={handles.couponDiscount}>
        {formatCurrencyStyle(coupon.discount)}
      </p>
      <div className={handles.couponDiscountText}>
        <RichText text={coupon.discountText} />
      </div>
      <div className={handles.couponCopy}>
        {!hasAppliedCoupon ? (
          <>
            <div onClick={applyCoupon} className={handles.couponCopyArea}>
              <span className={handles.couponCopyText}>Cupom</span>
              <span className={handles.couponCopyName}>
                {coupon.name}
                <img
                  src="https://lfmaquinaseferramentas.vtexassets.com/assets/vtex.file-manager-graphql/images/47cc47b0-2aee-4596-b6db-e91d7547cddb___95ed77c44fcecd723658b33ba029e181.png"
                  width={24}
                  height={18}
                />
              </span>
            </div>
            <div onClick={applyCoupon} className={handles.couponCopyHover}>
              Aplicar Cupom
            </div>
          </>
        ) : (
          <div className={handles.couponApplied}>Cupom aplicado</div>
        )}
      </div>
      <div className={handles.couponConditionText}>
        <RichText text={coupon.conditionText} />
      </div>
    </li>
  )
}

export default CouponCard
