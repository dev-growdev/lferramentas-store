import React from 'react'
import style from './styles.css'
import { IconCartaoDeCredito } from './icons/cartao-de-credito'
import { IconPix } from './icons/pix'
import { IconBoleto } from './icons/boleto'

export type TabHeaderProps = {
  index: number
  setIndex: (index: number) => void
}

export const TabHeader = ({ index, setIndex }: TabHeaderProps) => {
  return (
    <div className={style.modalPagamentoTabsList}>

      <div className={style.modalPagamentoTabHead} onClick={() => { setIndex(1) }}>
        <span className={`${style.imgModalPagamento} ${index === 1 ? style.tabActive : null}`}>
          <IconPix />
        </span>
        <span className={`${style.labelModalPagamento} ${index === 1 ? style.tabActive : null}`}>
          <p>Pix</p>
        </span>
      </div>

      <div className={style.modalPagamentoTabHead} onClick={() => { setIndex(2) }}>
        <span className={`${style.imgModalPagamento} ${index === 2 ? style.tabActive : null}`}>
          <IconBoleto />
        </span>
        <span className={`${style.labelModalPagamento} ${index === 2 ? style.tabActive : null}`}>
          <p>Boleto</p>
        </span>
      </div>
      <div className={style.modalPagamentoTabHead} onClick={() => { setIndex(0) }}>
        <span className={`${style.imgModalPagamento} ${index === 0 ? style.tabActive : null}`}>
          <IconCartaoDeCredito />
        </span>
        <span className={`${style.labelModalPagamento} ${index === 0 ? style.tabActive : null}`}>
          <p>Cartão de Crédito</p>
        </span>
      </div>

    </div>
  )
}
