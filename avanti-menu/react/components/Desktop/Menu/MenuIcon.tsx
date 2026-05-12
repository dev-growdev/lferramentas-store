import React from "react"
import { useCssHandles } from "vtex.css-handles"
import { OthersProps } from "../../../typings/types"
import { CSS_HANDLES } from "../CSS_HANDLES"

export const MenuIcon = ({ src }: OthersProps) => {

  const css = useCssHandles(CSS_HANDLES)

  return (
    <>
      {src ?
        <span className={css['desktop-menuIconContent']}>
          <img width={22} height={20} src={src} className={css['desktop-menuIcon']} />
        </span>
        : ''}
    </>
  )
}
