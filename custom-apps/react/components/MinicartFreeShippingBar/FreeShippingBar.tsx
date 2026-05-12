import React, { useEffect, useState } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import css from './style.css'
import { applyModifiers } from 'vtex.css-handles'
declare var window: Window
interface Window {
  zipCodeList: ZipCodeList[]
}

interface ZipCodeList {
  freeShippingValue: number
  zipCodeEnd: string
  zipCodeInitial: string
}

const FreeShippingBar = () => {
  const {
    orderForm: { totalizers, shipping },
  } = useOrderForm()

  const [cepUser, setCepUser] = useState<string>('')
  const [isUserCepOnZipCodeList, setIsUserCepOnZipCodeList] = useState<boolean>(
    false
  )

  const [totalOrderValue, setTotalOrderValue] = useState(0)
  const [freeShippingValue, setFreeShippingValue] = useState<number>(0)
  const [freeShippingMissingAmount, setFreeShippingMissingAmount] = useState<
    number
  >()

  const [orderValuePercentage, setOrderValuePercentage] = useState<number>(0)

  useEffect(() => {
    setCepUser(shipping.selectedAddress?.postalCode.replace('-', ''))

    if (window.zipCodeList) {
      window.zipCodeList.forEach(codeRange => {
        if (
          codeRange.zipCodeInitial <= cepUser &&
          codeRange.zipCodeEnd >= cepUser
        ) {
          setIsUserCepOnZipCodeList(true)
          setFreeShippingValue(codeRange.freeShippingValue / 100)
        }
      })
    }

    totalizers[0] && setTotalOrderValue(totalizers[0].value / 100)
    setFreeShippingMissingAmount(freeShippingValue - totalOrderValue)

    if (freeShippingMissingAmount != null && freeShippingMissingAmount > 0) {
      setOrderValuePercentage((totalOrderValue * 100) / freeShippingValue)
    } else if (
      freeShippingMissingAmount != null &&
      freeShippingMissingAmount <= 0
    ) {
      setOrderValuePercentage(100)
    }

    return () => {
      setOrderValuePercentage(0)
      setCepUser('')
      setIsUserCepOnZipCodeList(false)
      setTotalOrderValue(0)
    }
  })

  return (
    <>
      {isUserCepOnZipCodeList && orderValuePercentage ? (
        <div className={css.freeShippingContainer}>
          <div className={css.freeShippingLabel}>
            {orderValuePercentage > 0 && orderValuePercentage < 100 ? (
              <span className={css.freeShippingLabel}>
                Faltam{' '}
                <span className={css.freeShippingMissingAmount}>
                  R${' '}
                  {freeShippingMissingAmount?.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </span>{' '}
                para ganhar frete grátis
              </span>
            ) : (
              <span className={css.freeShippingLabel}>
                Você ganhou frete grátis
              </span>
            )}
          </div>

          <div className={css.freeShippingBar}>
            <span
              className={applyModifiers(
                css.freeShippingBarColor,
                orderValuePercentage >= 100 ? 'freeShippingBarColorWin' : ''
              )}
              style={{ width: `${orderValuePercentage}%`, minWidth: '4%' }}
            >
              <span className={css.freeShippingBarIcon}>
                {orderValuePercentage < 100 ? (
                  <svg
                    className={css.freeShippingBarIconSvg}
                    width="22"
                    height="16"
                    viewBox="0 0 22 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 4H16V0H2C0.895 0 0 0.895 0 2V13H2C2 14.655 3.345 16 5 16C6.655 16 8 14.655 8 13H14C14 14.655 15.345 16 17 16C18.655 16 20 14.655 20 13H22V8L19 4ZM5 14.5C4.17 14.5 3.5 13.83 3.5 13C3.5 12.17 4.17 11.5 5 11.5C5.83 11.5 6.5 12.17 6.5 13C6.5 13.83 5.83 14.5 5 14.5ZM18.5 5.5L20.465 8H16V5.5H18.5ZM17 14.5C16.17 14.5 15.5 13.83 15.5 13C15.5 12.17 16.17 11.5 17 11.5C17.83 11.5 18.5 12.17 18.5 13C18.5 13.83 17.83 14.5 17 14.5Z"
                      fill="#CD3C26"
                    />
                  </svg>
                ) : (
                  <svg
                    className={css.freeShippingBarIconSvg}
                    width="22"
                    height="16"
                    viewBox="0 0 22 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 4H16V0H2C0.895 0 0 0.895 0 2V13H2C2 14.655 3.345 16 5 16C6.655 16 8 14.655 8 13H14C14 14.655 15.345 16 17 16C18.655 16 20 14.655 20 13H22V8L19 4ZM5 14.5C4.17 14.5 3.5 13.83 3.5 13C3.5 12.17 4.17 11.5 5 11.5C5.83 11.5 6.5 12.17 6.5 13C6.5 13.83 5.83 14.5 5 14.5ZM18.5 5.5L20.465 8H16V5.5H18.5ZM17 14.5C16.17 14.5 15.5 13.83 15.5 13C15.5 12.17 16.17 11.5 17 11.5C17.83 11.5 18.5 12.17 18.5 13C18.5 13.83 17.83 14.5 17 14.5Z"
                      fill="#555A44"
                    />
                  </svg>
                )}
              </span>
            </span>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default FreeShippingBar
