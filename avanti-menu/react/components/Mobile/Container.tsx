import React from "react"
import { useCssHandles, applyModifiers } from "vtex.css-handles"
import { useAvantiMenuMobile } from "../../context/AvantiMenuContext"
import { AvantiMenuChildrenProps } from "../../typings/types"
import { CSS_HANDLES } from "./CSS_HANDLES"

export const Container = ({ children }: AvantiMenuChildrenProps) => {
  
  const { open } = useAvantiMenuMobile()
  const css = useCssHandles(CSS_HANDLES)

  return (
    <div className={applyModifiers(css['mobile-container'], open ? 'Opened' : '')}>
      <div className={css['mobile-content']}>
        {children}
      </div>
    </div>
  )
}
