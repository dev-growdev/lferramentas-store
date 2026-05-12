import React from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { AvantiMenuChildrenProps, OthersProps } from "../../../typings/types"
import { CSS_HANDLES } from "../CSS_HANDLES"
import { Link } from "vtex.render-runtime"


export const MenuItemsTitle = ({ children, modifier, url }: AvantiMenuChildrenProps & OthersProps) => {

  const css = useCssHandles(CSS_HANDLES)

  return (
    <Link to={url ? url : undefined} className={applyModifiers(css['desktop-menuItemsTitleLink'], modifier ? modifier : '')}>
      <h3 className={applyModifiers(css['desktop-menuItemsTitle'], modifier ? modifier : '')}>
        {children}
      </h3>
    </Link>
  )
}
