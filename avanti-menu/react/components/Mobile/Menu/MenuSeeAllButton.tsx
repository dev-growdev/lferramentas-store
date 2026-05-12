import React from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { useAvantiMenuMobile } from "../../../context/AvantiMenuContext"
import { OthersProps } from "../../../typings/types"
import { CSS_HANDLES } from "../CSS_HANDLES"
import { Link } from "vtex.render-runtime"

export const MenuSeeAllButton = ({ url, modifier }: OthersProps) => {

  const css = useCssHandles(CSS_HANDLES)
  const { props, setOpen } = useAvantiMenuMobile()

  return (
    <Link onClick={() => setOpen(false)} to={url} className={applyModifiers(css['mobile-menuSeeAllButton'], modifier ? modifier : '')}>
      {props.seeAllButton}
    </Link>
  )
}
