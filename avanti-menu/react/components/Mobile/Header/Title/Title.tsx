import React from "react"
import { useCssHandles } from "vtex.css-handles"
import { useAvantiMenuMobile } from "../../../../context/AvantiMenuContext"
import { CSS_HANDLES } from "../../CSS_HANDLES"

export const Title = () => {
  
  const { props } = useAvantiMenuMobile()
  const css = useCssHandles(CSS_HANDLES)

  return (
    <div className={css['mobile-titleContent']}>
      <span className={css['mobile-title']}>{props.header?.title}</span>
    </div>
  )
}
