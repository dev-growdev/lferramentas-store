import React from "react"
import { useCssHandles } from "vtex.css-handles"
import { OthersProps } from "../../../typings/types"
import { CSS_HANDLES } from "../CSS_HANDLES"

export const MenuArrow = ({ fill }: OthersProps) => {
  
  const css = useCssHandles(CSS_HANDLES)
  
  return (
    <div className={css['desktop-arrowIconContent']}>
      <svg fill={fill ?? fill} className={css['desktop-arrowIcon']} xmlns="http://www.w3.org/2000/svg" width="10px" height="17px" viewBox="0 0 10 17">
        <g id="Grupo_776" data-name="Grupo 776">
        <path d="M9.7,7.8L1.9,0.5c-0.4-0.4-1.1-0.4-1.6,0c-0.4,0.4-0.4,1-0.1,1.4c0,0,0,0,0.1,0.1l7,6.5
    l-7,6.5c-0.4,0.4-0.4,1-0.1,1.4c0,0,0,0,0.1,0.1c0.4,0.4,1.1,0.4,1.6,0l7.8-7.2C10.1,8.9,10.1,8.2,9.7,7.8C9.7,7.8,9.7,7.8,9.7,7.8
    z" transform="translate(0 0)" fillRule="evenodd"></path>
        </g>
      </svg>
    </div>
  )
}
