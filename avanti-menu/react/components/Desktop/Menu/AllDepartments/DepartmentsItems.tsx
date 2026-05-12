import React, { useMemo } from "react"
import { useCssHandles } from "vtex.css-handles"
import { useAvantiMenu } from "../../../../context/AvantiMenuContext"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { FirstLevelCategory } from "../Category/FirstLevelCategory"
import { FirstLevelCustom } from "../Custom/FirstLevelCustom"

export const DepartmentsItems = () => {

  const { items } = useAvantiMenu()
  const css = useCssHandles(CSS_HANDLES)

  const memoItems = useMemo(()=> items?.map((item, index) =>
  (item.desktop && item.departmentBar) && (
    <React.Fragment key={index}>
      {item.type === "custom" ? <FirstLevelCustom item={item} /> : <FirstLevelCategory item={item} />}
    </React.Fragment>
  )
), [items])

  return (
    <div className={css['desktop-menuItemsWrapper']}>
      <ul className={css['desktop-menuItems']}>
        {memoItems}
      </ul>
    </div>
  )
}

