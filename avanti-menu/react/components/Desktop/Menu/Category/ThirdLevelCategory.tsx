import React from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { CategoriesSubmenu, MenuItemsSubLevel } from "../../../../typings/types"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { MenuItemsTitle } from "../MenuItemsTitle"
import { FormatText } from "../../../Utils/FormatString"
import { MenuSeeAllButton } from "../MenuSeeAllButton"
import { useAvantiMenuDesktop } from "../../../../context/AvantiMenuContext"
import { Link } from "vtex.render-runtime"

export const ThirdLevelCategory = ({ children, title, titleURL, seeAll }: MenuItemsSubLevel) => {

  const css = useCssHandles(CSS_HANDLES)
  const { props } = useAvantiMenuDesktop()
  const newChildren: CategoriesSubmenu[] | undefined = props.thirdMaxItems ? children?.slice(0, props.thirdMaxItems) : children

  return (
    <>
      {newChildren?.length ?
        <>
          <div className={css['desktop-menuThirdItemsWrapper']}>
            <MenuItemsTitle url={titleURL} modifier={'Third'}>{title}</MenuItemsTitle>
            {seeAll && <MenuSeeAllButton url={titleURL} modifier={'Third'} />}
            <ul className={css['desktop-menuThirdItems']}>
              {newChildren.map(({ id, name, title, href }) => (
                <li className={applyModifiers(css['desktop-menuThirdItem'], FormatText(name))} key={id}>
                  <Link to={href} title={title || name}
                    className={applyModifiers(css['desktop-menuThirdItemLink'], FormatText(name))}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
        : ''}
    </>
  )
}
