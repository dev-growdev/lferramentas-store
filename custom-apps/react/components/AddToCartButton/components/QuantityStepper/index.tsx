import React from 'react'
import { FiPlus, FiMinus } from 'react-icons/fi'

import styles from './styles.css'

interface IQuantityStepper {
  productQuantity: number
  showUnit:boolean
  unit: string | undefined
  handleClickQuantity: (
    operation: 'removeFromCart' | 'addToCart' | 'first-item'
  ) => void
}

export const QuantityStepper = ({
  productQuantity,
  unit,
  showUnit,
  handleClickQuantity,
}: IQuantityStepper) => {

  return (
    <div
    className={styles['adtc-container-stepper']}
    onClick={event => {
      event.preventDefault();
      event.stopPropagation();
    }}
  >
      <button
        type="button"
        className={styles['adtc-button-decrement']}
        aria-label="Remover um"
        onClick={event => {
          event.preventDefault()
          event.stopPropagation()
          handleClickQuantity('removeFromCart')
        }}
      >
        <FiMinus
          className={styles['adtc-button-decrement']}
          size={13}
          color="#000000"
        />
      </button>

      <span className={styles['adtc-button-quantity']}>{productQuantity}
      {showUnit && unit && <span className={styles['adtc-span-unit']}>{unit}</span>}
      </span>

      <button
        type="button"
        className={styles['adtc-button-increment']}
        aria-label="Adicionar mais um"
        onClick={event => {
          event.preventDefault()
          event.stopPropagation()
          handleClickQuantity('addToCart')
        }}
      >
        <FiPlus
          className={styles['adtc-button-increment']}
          size={13}
          color="#000000"
        />
      </button>
    </div>
  )
}
