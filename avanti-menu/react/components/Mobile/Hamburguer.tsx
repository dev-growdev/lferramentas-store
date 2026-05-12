import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useAvantiMenuMobile } from '../../context/AvantiMenuContext'
import { CSS_HANDLES } from './CSS_HANDLES'

export const Hamburguer = () => {

  const { props, setOpen } = useAvantiMenuMobile()
  const css = useCssHandles(CSS_HANDLES)

  return (
    <button onClick={() => { setOpen(true) }} className={css['mobile-hamburguer']}>
      {props.burguerIcon ?
        <img width={32} height={24} src={props.burguerIcon} alt='Icone do Menu' aria-label="Menu" className={css['mobile-hamburguerImage']} />
        :
        <svg width="20" height="16" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="0.455078" width="16" height="2" fill="#3F3F40"></rect><rect y="5.45508" width="16" height="2" fill="#3F3F40"></rect><rect y="10.4551" width="16" height="2" fill="#3F3F40"></rect></svg>
      }
    </button>
  )
}
