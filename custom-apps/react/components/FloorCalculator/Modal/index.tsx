import React from 'react'
import { useCssHandles } from "vtex.css-handles"
import { cssHandles } from "../handles/index"

import type { IModal } from '../typings'
import { Header } from './Header'
import { Body } from './Body'
import { Footer } from './Footer'

export const Modal = ({ setOpenModal, data, setData }: IModal) => {
  const { handles: css } = useCssHandles(cssHandles)

  return (
    <>
      <div className={css['floorcalc-overflow']} onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        setOpenModal(false);
      }}></div>
      <div className={css['floorcalc-modal']}>
        <div className={css['floorcalc-modal-content']} onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}>
          <Header setOpenModal={setOpenModal} />

          <span className={css['floorcalc-modal-subTitle']}>
            Informe uma das opções a seguir para saber quanto de material comprar:
          </span>

          <Body data={data} setData={setData} setOpenModal={setOpenModal} />

          <Footer data={data} setData={setData} setOpenModal={setOpenModal} />

        </div>
      </div>
    </>
  )
}
