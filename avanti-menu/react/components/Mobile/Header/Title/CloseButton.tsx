import React from "react"
import { useCssHandles } from "vtex.css-handles"
import { useAvantiMenuMobile } from "../../../../context/AvantiMenuContext"
import { CSS_HANDLES } from "../../CSS_HANDLES"

export const CloseButton = () => {

  const css = useCssHandles(CSS_HANDLES)
  const { props, setOpen } = useAvantiMenuMobile()

  return (
    <button onClick={() => setOpen(false)} className={css['mobile-closeButton']}>
      {props.header?.closeIcon ?
        <img height={12} width={12} src={props.header.closeIcon} alt="Close Button" className={css['mobile-closeButtonImage']} />
        :
        <svg xmlns='http://www.w3.org/2000/svg' width='40px' height='40px' viewBox='0 0 40 40'><path d='M 10,10 L 30,30 M 30,10 L 10,30' stroke='black' stroke-width='4' stroke-linecap='butt'></path></svg>
      }
    </button>
  )
}
