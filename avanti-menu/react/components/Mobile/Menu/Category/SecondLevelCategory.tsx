import React from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { CategoriesSubmenu, MenuItemsSubLevel } from "../../../../typings/types"
import { FormatText } from "../../../Utils/FormatString"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { MenuArrow } from "../MenuArrow"
import { MenuBackButton } from "../MenuBackButton"
import { MenuItemsTitle } from "../MenuItemsTitle"
import { MenuItemsTitleContent } from "../MenuItemsTitleContent"
import { MenuSeeAllButton } from "../MenuSeeAllButton"
import { toggleClick } from "../../../Utils/toggleClick"
import { ThirdLevelCategory } from "./ThirdLevelCategory"
import { useAvantiMenuMobile } from "../../../../context/AvantiMenuContext"
import { Link } from "vtex.render-runtime"

export const SecondLevelCategory = ({ children, title, titleURL, seeAll }: MenuItemsSubLevel) => {

  const css = useCssHandles(CSS_HANDLES)
  const { props } = useAvantiMenuMobile()
  const newChildren: CategoriesSubmenu[] | undefined = props.secondMaxItems ? children?.slice(0, props.secondMaxItems) : children

  return (
    <div className={css['mobile-menuSecondItemsWrapper']}>
      <MenuItemsTitleContent>
        <MenuBackButton remove={css['mobile-menuItem--Opened']} />
        <MenuItemsTitle url={titleURL} modifier={'Second'}>{title}</MenuItemsTitle>
      </MenuItemsTitleContent>
      {seeAll && <MenuSeeAllButton url={titleURL} modifier={'Second'} />}
      <ul className={css['mobile-menuSecondItems']}>
        {newChildren?.map(({ id, name, title, children, href }) => (
          <li key={id}
            className={applyModifiers(css['mobile-menuSecondItem'], [
              FormatText(name),
              children.length ? 'hasChildren' : ''
            ]
            )}
          >
            {children.length && props.thirdDef ?
              (
                <button
                  type="button"
                  title={title || name}
                  onClick={(event) => toggleClick(event, css['mobile-menuSecondItem--Opened'])}
                  className={applyModifiers(css['mobile-menuSecondItemLink'], [
                    FormatText(name),
                    children.length ? 'hasChildren' : ''
                  ]
                  )}
                >
                  {name} {children.length && props.thirdDef ? <MenuArrow /> : ''}
                </button>
              ) :
              (<Link to={children.length && props.thirdDef ? undefined : href}
                title={title || name}
                className={applyModifiers(css['mobile-menuSecondItemLink'], [
                  FormatText(name)
                ]
                )}
              >
                {name}
              </Link>)}

            {props.thirdDef ?
              <ThirdLevelCategory
                children={children}
                title={name}
                titleURL={href}
                seeAll={seeAll}
              />
              : ''}
          </li>
        )
        )}
      </ul>
    </div>
  )
}
