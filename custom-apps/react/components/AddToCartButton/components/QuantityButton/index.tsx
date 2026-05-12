import React from 'react'
import { Spinner } from 'vtex.styleguide'
import styles from './styles.css'

interface IQuantityButton {
  handleClickQuantity: (
    operation: 'removeFromCart' | 'addToCart' | 'first-item'
  ) => void
  AvailableQuantity?: number
  loading: boolean
}

export const QuantityButton = ({
  handleClickQuantity,
  AvailableQuantity,
  loading,
}: IQuantityButton) => {
  return (
    <>
      <button
        onClick={event => {
          event.preventDefault()
          event.stopPropagation()
          handleClickQuantity('first-item')
        }}
        disabled={!AvailableQuantity || loading}
        className={styles['adtc-button-add-to-cart']}
      >
        {loading ? <Spinner color="#fff" size={20} />
          : <p className={styles['adtc-button-text-add']}>{!AvailableQuantity ? "Indisponível" : "Comprar"}</p>
        }
      </button>
    </>
  )
}
