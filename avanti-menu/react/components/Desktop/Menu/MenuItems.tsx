import React, { useMemo } from "react"
import { useCssHandles } from "vtex.css-handles"
import { useAvantiMenu, useAvantiMenuDesktop } from "../../../context/AvantiMenuContext"
import { CSS_HANDLES } from "../CSS_HANDLES"
import { AllDepartments } from "./AllDepartments/AllDepartments"
import { FirstLevelCategory } from "./Category/FirstLevelCategory"
import { FirstLevelCustom } from "./Custom/FirstLevelCustom"

export const MenuItems = () => {

  const { items } = useAvantiMenu()
  const { props } = useAvantiMenuDesktop()
  const css = useCssHandles(CSS_HANDLES)
  let child = 0

  const memoItems = useMemo(()=> items?.map((item, index) => {

    (item.desktop && item.menuBar) && child++

    return (item.desktop && item.menuBar) && (
      <React.Fragment key={index}>
        {item.type === "custom" ? <FirstLevelCustom item={item} index={child} /> : <FirstLevelCategory item={item} index={child} />}
      </React.Fragment>
    )
    }
  ), [items])

  return (
    <div className={css['desktop-menuItemsWrapper']}>
      <ul className={`${css['desktop-menuItems']} ${css['desktop-menuItemsNav']}`}>
        {props.departmentDef && <AllDepartments />}
        {memoItems}
      </ul>
    </div>
  )
}
