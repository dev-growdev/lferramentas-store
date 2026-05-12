import React from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { useAvantiMenuDesktop } from "../../../context/AvantiMenuContext"
import { OthersProps } from "../../../typings/types"
import { CSS_HANDLES } from "../CSS_HANDLES"
import { Link } from "vtex.render-runtime"

export const MenuSeeAllButton = ({ url, modifier }: OthersProps) => {

  const css = useCssHandles(CSS_HANDLES)
  const { props } = useAvantiMenuDesktop()

  return (
    <Link to={url} className={applyModifiers(css['desktop-menuSeeAllButton'], modifier ? modifier : '')}>
      {props.seeAllButton}
    </Link>
  )
}
