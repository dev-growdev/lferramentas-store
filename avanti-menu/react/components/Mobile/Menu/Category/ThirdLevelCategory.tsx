import React from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { CategoriesSubmenu, MenuItemsSubLevel } from "../../../../typings/types"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { MenuItemsTitleContent } from "../MenuItemsTitleContent"
import { MenuBackButton } from "../MenuBackButton"
import { MenuItemsTitle } from "../MenuItemsTitle"
import { MenuSeeAllButton } from "../MenuSeeAllButton"
import { FormatText } from "../../../Utils/FormatString"
import { useAvantiMenuMobile } from "../../../../context/AvantiMenuContext"
import { Link } from "vtex.render-runtime"

export const ThirdLevelCategory = ({ children, title, titleURL, seeAll }: MenuItemsSubLevel) => {

  const css = useCssHandles(CSS_HANDLES)
  const { props } = useAvantiMenuMobile()
  const newChildren: CategoriesSubmenu[] | undefined = props.thirdMaxItems ? children?.slice(0, props.thirdMaxItems) : children

  return (
    <>
      {newChildren?.length ?
        <div className={css['mobile-menuThirdItemsWrapper']}>
          <MenuItemsTitleContent>
            <MenuBackButton remove={css['mobile-menuSecondItem--Opened']} />
            <MenuItemsTitle url={titleURL} modifier={'Third'}>{title}</MenuItemsTitle>
          </MenuItemsTitleContent>
          {seeAll && <MenuSeeAllButton url={titleURL} modifier={'Third'} />}
          <ul className={css['mobile-menuThirdItems']}>
            {newChildren?.map(({ id, name, title, href }) => (
              <li className={applyModifiers(css['mobile-menuThirdItem'], FormatText(name))} key={id}>
                <Link to={href} title={title || name}
                  className={applyModifiers(css['mobile-menuThirdItemLink'], FormatText(name))}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        : ''}
    </>
  )
}
