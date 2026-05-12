import React, { useMemo } from "react"
import { useCssHandles } from "vtex.css-handles"
import { useAvantiMenu } from "../../../context/AvantiMenuContext"
import { CSS_HANDLES } from "../CSS_HANDLES"
import { FirstLevelCategory } from "./Category/FirstLevelCategory"
import { FirstLevelCustom } from "./Custom/FirstLevelCustom"

export const MenuItems = () => {

  const { items } = useAvantiMenu()
  const css = useCssHandles(CSS_HANDLES)

  const memoItems = useMemo(()=> items?.map((item, index) => 
    item.mobile && (      
      <React.Fragment key={index}>
        {item.type === "custom" ? <FirstLevelCustom item={item} /> : <FirstLevelCategory item={item} />}
      </React.Fragment>
    )
  ), [items])

  return (
    <div className={css['mobile-menuContainer']}>
      <div className={css['mobile-menuItemsWrapper']}>
        <ul className={css['mobile-menuItems']}>
          {memoItems}
        </ul>
      </div>
    </div>
  )
}
