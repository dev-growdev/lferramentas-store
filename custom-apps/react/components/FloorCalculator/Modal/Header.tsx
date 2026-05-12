import React from 'react'
import CloseIcon from '../common/CloseIcon'
import { useCssHandles } from 'vtex.css-handles'
import { cssHandles } from '../handles/index'
import { IHeader } from '../typings'
import CalculatorIcon from '../common/CalculatorIcon'

export const Header = ({ setOpenModal }: IHeader) => {
  const { handles: css } = useCssHandles(cssHandles)
  const [colorName] = React.useState('ffe72e')

  return (
    <div className={css['floorcalc-modal__header']}>
      <CalculatorIcon color={colorName} />
      <span className={css['floorcalc-modal__title']}>
        Calculadora de m<sup>2</sup>
      </span>
      <button
        onClick={() => setOpenModal(false)}
        className={css['floorcalc-modal-close']}
      >
        <CloseIcon />
      </button>
    </div>
  )
}
