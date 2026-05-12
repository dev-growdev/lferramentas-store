import React from "react"
import { useCssHandles } from "vtex.css-handles"
import { useAvantiMenuDesktop } from "../../../../context/AvantiMenuContext"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { DepartmentsItems } from "./DepartmentsItems"
import { DepartmentsIcon } from "./DepartmentsIcon"

export const AllDepartments = () => {

  const css = useCssHandles(CSS_HANDLES)
  const { props } = useAvantiMenuDesktop()

  return (
    <li className={css['desktop-departmentsItem']}>
      <div title={props.department} className={css['desktop-departmentsItemLink']}>
        <DepartmentsIcon />
        {props.department}
      </div>
      <DepartmentsItems />
    </li>
  )
}
