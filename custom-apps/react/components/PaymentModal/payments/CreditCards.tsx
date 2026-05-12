import React, { useEffect, useState } from 'react'
import { useProduct } from 'vtex.product-context'
import { propsIntallments } from './type'
import style from './style.css'
import '../styles.css'
import amex from './group-payments/amex.svg'
import elo from './group-payments/elo.svg'
import mastercard from './group-payments/mastercard.svg'
import diners from './group-payments/diners.svg'
import visa from './group-payments/visa.svg'
import paypal from './group-payments/paypal.svg'
import hipercard from './group-payments/hipercard.svg'
import { formatCurrency } from '../../../utils/pricePix'

interface Payment {
  title: string
  icon: any
  installments: any[]
}

function calculateDiscount(value?: number) {
  if (!value) throw new Error('Value undefined')

  const discount = value
  const discountedValue = value

  return {
    priceWithDiscountFormatted: formatCurrency(
      Number(discountedValue.toFixed(2))
    ),
    priceDiscounted: formatCurrency(Number(discount.toFixed(2))),
  }
}

const renderPriceTotalInstallment = (item: propsIntallments) => {
  const defaultPrice = item.TotalValuePlusInterestRate?.toLocaleString(
    'pt-br',
    { style: 'currency', currency: 'BRL' }
  )

  if (item.NumberOfInstallments === 1) {
    const priceWithDiscount = calculateDiscount(item?.Value ?? 0)
    return <span>{priceWithDiscount?.priceWithDiscountFormatted}</span>
  }

  return <>{defaultPrice}</>
}

const renderPriceEachInstallment = (item: propsIntallments) => {
  const defaultPrice: any = item?.Value?.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  })

  if (item.NumberOfInstallments === 1) {
    const priceWithDiscount = calculateDiscount(item?.Value ?? 0)

    return (
      <span>
        {priceWithDiscount?.priceWithDiscountFormatted}{' '}
        <strong>(Economize {priceWithDiscount?.priceDiscounted})</strong>
      </span>
    )
  }

  return <>{defaultPrice}</>
}

export default function CreditCards() {
  const productContext: any = useProduct(),
    itemSellerDefault = (productContext?.selectedItem?.sellers as Array<
      any
    >).find(seller => seller.sellerDefault)

  const [installments, setInstallments] = useState<any>([])
  const [selectedCreditCard, setSelectedCreditCard] = useState<string>(
    'Visa'
  )
  const [loading, setloading] = useState<boolean>(false)

  useEffect(() => {
    let paymentForms: Payment[] = [
      { title: 'Visa', icon: visa, installments: [] },
      { title: 'Mastercard', icon: mastercard, installments: [] },
      { title: 'Elo', icon: elo, installments: [] },
      { title: 'Hipercard', icon: hipercard, installments: [] },
      { title: 'Diners', icon: diners, installments: [] },
      { title: 'American Express', icon: amex, installments: [] },
      { title: 'PayPal', icon: paypal, installments: [] },
    ]

    paymentForms.map((payment: Payment) => {
      payment.installments = itemSellerDefault?.commertialOffer?.Installments.filter(
        (installment: any) =>
          installment.PaymentSystemName.toLowerCase() ==
          payment.title.toLowerCase()
      )
    })

    setInstallments(paymentForms)

    setloading(true)
  }, [productContext])

  const RenderInstallments = () => {
    return (
      <>
        <div className={style.containerCartaoCredito}>
          <div>
            <label className={style.label}>Cartões aceitos:</label>
            <div className={style.cards}>
              <ul>
                {installments?.map((item: Payment, index: number) => {
                  if (item.installments && item.installments.length > 0) {
                    return (
                      <li
                        key={index}
                        onClick={() => setSelectedCreditCard(item.title)}
                        className={item.title === selectedCreditCard ? style.cardActive : style.card}
                      >
                        <img src={item?.icon} title={item.title} />
                        <span>
                          até{' '}
                          {
                            item.installments[item.installments.length - 1]
                              .NumberOfInstallments
                          }
                          x
                        </span>
                      </li>
                    )
                  }
                  return null
                })}
              </ul>
            </div>
          </div>
          <div className={style.containerNumeroVezes + ' ' + style.mt2}>
            <label className={style.label}>
              Demonstrativo do parcelamento:
            </label>
            <div className={style.wrapperTable}>
              <table className={style.tablePaymentCard}>
                {installments
                  .find((item: any) => item.title === selectedCreditCard)
                  .installments.map((installment: any) => (
                    <>
                      <tr>
                        <td>{installment.NumberOfInstallments}x</td>
                        <td>{renderPriceEachInstallment(installment)}</td>
                        <td>
                          {installment.InterestRate === 0
                            ? 'sem juros'
                            : 'com juros'}
                        </td>
                        <td>{renderPriceTotalInstallment(installment)}</td>
                      </tr>
                    </>
                  ))}
              </table>
            </div>
          </div>
        </div>
      </>
    )
  }

  return <>{loading ? <RenderInstallments /> : null}</>
}
