import React from "react"
import { useCssHandles } from "vtex.css-handles"
import { OthersProps } from "../../../typings/types"
import { CSS_HANDLES } from "../CSS_HANDLES"

export const MenuArrow = ({fill}: OthersProps) => {
  
  const css = useCssHandles(CSS_HANDLES)
  
  return (
    <div className={css['mobile-menuArrowIconContent']}>
      <svg fill={fill ?? fill} className={css['mobile-menuArrowIcon']} xmlns="http://www.w3.org/2000/svg" width="18" height="10" viewBox="0 0 9.406 5.672"><g id="Grupo_776" data-name="Grupo 776"><path id="Caminho_386" data-name="Caminho 386" d="M5.111,5.49,9.237,1.074a.674.674,0,0,0,0-.892.566.566,0,0,0-.831,0L4.7,4.159,1,.181a.566.566,0,0,0-.831,0,.674.674,0,0,0,0,.892L4.281,5.49A.566.566,0,0,0,5.111,5.49Z" transform="translate(0 0)" fillRule="evenodd"></path></g></svg>
    </div>
  )
}
