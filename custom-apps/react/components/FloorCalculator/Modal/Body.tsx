import React from "react";
import { useCssHandles } from "vtex.css-handles"
import { cssHandles } from "../handles/index"
import { IModal } from '../typings'

export const Body = ({ data, setData }: IModal) => {
  const { handles: css } = useCssHandles(cssHandles)

  return (
    <div className={css['floorcalc-modal-body']}>
      <div className={css['floorcalc-modal-body__single-input']}>
        <div className={css['floorcalc-modal-body__container-input']}>
          <label className={css['floorcalc-modal-text']}>Área total (m<sup>2</sup>)</label>
          <input onChange={(e: any) => setData({
            ...data,
            totalWidthLength: e.target.value
          })}
            className={css['floorcalc-modal-input']} type="number" placeholder='Exemplo: 5' />
        </div>
      </div>

      <div className={css['floorcalc-modal-body__or']}>
        <span className={css['floorcalc-modal-body__or-text']}>ou</span>
      </div>

      <div className={css['floorcalc-modal-body__double-input']}>
        <div className={css['floorcalc-modal-body__container-input']}>
          <label className={css['floorcalc-modal-text']}>Comprimento (m)</label>
          <input onChange={(e: any) => setData({
            ...data,
            length: e.target.value
          })}
            className={css['floorcalc-modal-input']} type="number" placeholder='Exemplo: 5' />
        </div>
        <div className={css['floorcalc-modal-body__element-versus']}>
          x
        </div>
        <div className={css['floorcalc-modal-body__container-input']}>
          <label className={css['floorcalc-modal-text']}>Largura (m)</label>
          <input
            onChange={(e: any) => setData({
              ...data,
              width: e.target.value
            })}
            className={css['floorcalc-modal-input']} type="number" placeholder='Exemplo: 3.5' />
        </div>
      </div>
    </div>
  )
}
