import React from "react"
import { useCssHandles } from "vtex.css-handles"
import { backClick } from "../../Utils/backClick"
import { CSS_HANDLES } from "../CSS_HANDLES"
import { MenuArrow } from "./MenuArrow"
import { useAvantiMenuMobile } from "../../../context/AvantiMenuContext"
import { OthersProps } from "../../../typings/types"

export const MenuBackButton = ({ remove }: OthersProps) => {

  const css = useCssHandles(CSS_HANDLES)
  const { props } = useAvantiMenuMobile()

  return (
    <button onClick={(event) => backClick(event, remove ? remove  : '')} className={css['mobile-menuBackButton']}>
      <MenuArrow /> {props.backButton}
    </button>
  )
}
