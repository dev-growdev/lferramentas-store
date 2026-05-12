import React from "react"
import { useCssHandles } from "vtex.css-handles"
import { OthersProps } from "../../../typings/types"
import { CSS_HANDLES } from "../CSS_HANDLES"

export const MenuIcon = ({ src }: OthersProps) => {
  
  const css = useCssHandles(CSS_HANDLES)
  
  return (
    <>
      {src ? 
        <span className={css['mobile-menuIconContent']}>
          <img src={src} className={css['mobile-menuIcon']} />
        </span>
      : ''}
    </>
  )
}
