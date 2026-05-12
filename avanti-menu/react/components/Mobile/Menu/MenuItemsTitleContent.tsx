import React from "react"
import { useCssHandles } from "vtex.css-handles"
import { CSS_HANDLES } from "../CSS_HANDLES"
import { AvantiMenuChildrenProps } from "../../../typings/types"


export const MenuItemsTitleContent = ({ children }: AvantiMenuChildrenProps) => {
  
  const css = useCssHandles(CSS_HANDLES)

  return (
    <div className={css['mobile-menuItemsTitleContent']}>
      {children}
    </div>
  )
}
