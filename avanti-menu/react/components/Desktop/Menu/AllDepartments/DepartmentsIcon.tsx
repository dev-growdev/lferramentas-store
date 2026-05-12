import React from "react"
import { useCssHandles } from "vtex.css-handles"
import { useAvantiMenuDesktop } from "../../../../context/AvantiMenuContext"
import { CSS_HANDLES } from "../../CSS_HANDLES"

export const DepartmentsIcon = () => {

  const css = useCssHandles(CSS_HANDLES)
  const { props } = useAvantiMenuDesktop()

  return (
    <>
      {props.departmentIcon ?
        <span className={css['desktop-departmentsIconContent']}>
          <img width={14} height={14} src={props.departmentIcon} className={css['desktop-departmentsIcon']} alt="Todas as categorias" />
        </span>
        :
        props.departmentIcon === null ?
          ''
          :
          <span className={css['desktop-departmentsIconContent']}>
            <svg className={css['desktop-departmentsIcon']} xmlns="http://www.w3.org/2000/svg" width="18px" height="14px" viewBox="4 2 18 14">
              <g transform="translate(-359.585 -55.411)"><g><path d="M380.6,59.4h-16c-0.6,0-1-0.4-1-1s0.4-1,1-1h16c0.6,0,1,0.4,1,1S381.1,59.4,380.6,59.4z" /></g><g><path d="M380.6,65.4h-16c-0.6,0-1-0.4-1-1c0-0.6,0.4-1,1-1h16c0.6,0,1,0.4,1,1C381.6,65,381.1,65.4,380.6,65.4z" /></g><g><path d="M380.6,71.4h-16c-0.6,0-1-0.4-1-1s0.4-1,1-1h16c0.6,0,1,0.4,1,1S381.1,71.4,380.6,71.4z" /></g>
              </g>
            </svg>
          </span>
      }
    </>
  )
}
