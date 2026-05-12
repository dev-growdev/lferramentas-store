import React, { useState, useEffect } from 'react'
import { FiPlus, FiMinus } from 'react-icons/fi'

import styles from './styles.css'

interface IQuantityStepper {
  availableQuantity: number
  id: string
  seller: string
  unit: string
  unitMultiplier: number
  handleQuantity: (data: {
    id: number
    quantity: number
    seller: number
  }) => void
}

const getUnitMeasureToShow = (unit: string) => {
  const validUnits = ['m']

  return validUnits.includes(unit.toLocaleLowerCase())
}

export const QuantityStepper = ({
  availableQuantity,
  handleQuantity,
  id,
  seller,
  unit,
  unitMultiplier,
}: IQuantityStepper) => {
  const [quantity, setQuantity] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const showUnitMeasure = getUnitMeasureToShow(unit)

  const removeQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (quantity > 0) {
      setQuantity(prevQuantity => prevQuantity - 1)
      setIsMounted(true)
    }
  }

  const addQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (quantity == availableQuantity) {
      return
    }
    setIsMounted(true)
    setQuantity(prevQuantity => prevQuantity + 1)
  }

  useEffect(() => {
    if (quantity == 0 && !isMounted) {
      return
    }
    handleQuantity({
      id: Number(id),
      quantity: quantity,
      seller: Number(seller),
    })
  }, [quantity])

  return (
    <>
      {availableQuantity <= 0 ? (
        <div className={styles['adtc-unavailable-item-wrapper']}>
          <span className={styles['adtc-unavailable-item']}>Indisponível</span>
        </div>
      ) : (
        <div
          className={styles['adtc-container-stepper']}
          onClick={event => {
            event.preventDefault()
            event.stopPropagation()
          }}
        >
          <button
            type="button"
            className={styles['adtc-button-decrement']}
            aria-label="Remover um"
            onClick={e => {
              removeQuantity(e)
            }}
          >
            <FiMinus
              className={styles['adtc-button-decrement']}
              size={13}
              color="#000000"
            />
          </button>

          <span className={styles['adtc-button-quantity']}>
            {quantity * unitMultiplier}
            {showUnitMeasure && unit && <span className={styles['adtc-span-unit']}>{unit}</span>}
          </span>

          <button
            type="button"
            className={styles['adtc-button-increment']}
            aria-label="Adicionar mais um"
            onClick={e => {
              addQuantity(e)
            }}
          >
            <FiPlus
              className={styles['adtc-button-increment']}
              size={13}
              color="#000000"
            />
          </button>
        </div>
      )}
    </>
  )
}
