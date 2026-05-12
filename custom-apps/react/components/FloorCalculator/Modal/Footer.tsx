import React, { useEffect, useState } from 'react'
import { handleResultCalc } from '../utils'
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { cssHandles } from "../handles/index"
import { IFooter } from '../typings'
import { Wrapper } from 'vtex.add-to-cart-button'
import { useProductDispatch } from 'vtex.product-context'

export const Footer = ({ data, setOpenModal, setData }: IFooter) => {
  const { handles: css } = useCssHandles(cssHandles)
  const [calcError, setCalcError] = React.useState(false)
  const [clickedOnCalculate, setClickedOnCalculate] = React.useState(false)
  const totalCaixas = Math.ceil(data.calcResult / data.unitMultiplier)
  const productContextDispatch = useProductDispatch()
  const [showAdditionalOption, setShowAdditionalOption] = useState(false)

  useEffect(() => {
    setData({
      ...data,
      calcResult: handleResultCalc(data)
    })
  }, [data.option.fifteen, data.option.ten])

  useEffect(() => {
    if (totalCaixas >= 1) {
      productContextDispatch?.({
        type: 'SET_QUANTITY',
        args: {
          quantity: totalCaixas,
        },
      })
    }
  }, [totalCaixas])

  if (clickedOnCalculate) {
    const nodeListBtn: any = document.querySelectorAll(".lfmaquinaseferramentas-custom-apps-0-x-floorcalc-modal-footer__primary-button .vtex-button");

    if (nodeListBtn.length > 0) {
      const addToCartButton = nodeListBtn[0];
      if (addToCartButton) {
        addToCartButton.onclick = function () {
          setOpenModal(false);
        };
      }
    }
  }

  return (
    <div className={css['floorcalc-modal-footer']}>
      {showAdditionalOption && data.calcResult > 0 && (
        <div className={css['floorcalc-modal-footer__multi-option']}>
          <div className={applyModifiers(css['floorcalc-modal-footer__option-ten'], [data.option.ten ? 'active' : ''])}
            onClick={() => setData({
              ...data,
              option: {
                ten: !data.option.ten,
                fifteen: false
              }
            })}>
            Adicionar 10% de quebra em instalação na horizontal ou vertical
          </div>
          <div className={applyModifiers(css['floorcalc-modal-footer__option-fifteen'], [data.option.fifteen ? 'active' : ''])}
            onClick={() => setData({
              ...data,
              option: {
                ten: false,
                fifteen: !data.option.fifteen
              }
            })}>
            Adicionar 15% de quebra em instalação na diagonal
          </div>
        </div>
      )}

      {
        data.calcResult > 0 &&

        <>
          <div className={css['floorcalc-modal-footer__final-result-1']}>
            <span className={css['floorcalc-modal-text']}>Total:</span>
            <span className={css['floorcalc-modal-text']}>{data.calcResult.toFixed(2)}m²</span>
          </div>

          <div className={css['floorcalc-modal-footer__final-result-2']}>
            <span className={css['floorcalc-modal-text']}>Será necessário:</span>
            <span className={css['floorcalc-modal-text']}>
              {totalCaixas <= 1 ? 1 : totalCaixas}
              {totalCaixas <= 1 ? " caixa" : " caixas"}</span>
          </div>

          <div className={css['floorcalc-modal-footer__final-result-3']}>
            <span className={css['floorcalc-modal-text']}>Cada caixa contém:</span>
            <span className={css['floorcalc-modal-text']}>{data.unitMultiplier}m²</span>
          </div>

          <div className={css['floorcalc-modal-footer__warning']}>
            <span className={css['floorcalc-modal-footer__warning-icon']}></span>
            <span className={css['floorcalc-modal-footer__warning-text']}>Consulte o responsável pela instalação sobre necessidade de adicional para recorte.</span>
          </div>
        </>
      }
      {
        data.calcResult <= 0 &&
        <button
          className={css['floorcalc-modal-footer__primary-button']}
          onClick={() => {
            setData({
              ...data,
              calcResult: handleResultCalc(data)
            })
            setCalcError(true)
            setClickedOnCalculate(true)
            setShowAdditionalOption(true)
          }}
        >Calcular</button>
      }
      {
        data.calcResult <= 0 && calcError &&
        <span
          className={css[`floorcalc-modal-footer__error`]}>
          Favor preencher todos os campos
        </span>
      }
      <div className={css['floorcalc-modal-footer__buttons']}>
        {
          data.calcResult > 0 &&
          <div
            onClick={(event: any) => {
              event.preventDefault()
              event.stopPropagation()
              setOpenModal(false);
              setCalcError(false)
            }}
            className={css['floorcalc-modal-footer__primary-button']}
          >
            <Wrapper text="Adicionar quantidade" />
          </div>
        }
      </div>
    </div >
  )
}
