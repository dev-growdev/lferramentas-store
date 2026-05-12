import React from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { CategoriesSubmenu, MenuItemsSubLevel } from "../../../../typings/types"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { MenuArrow } from "../MenuArrow"
import { MenuItemsTitle } from "../MenuItemsTitle"
import { FormatText } from "../../../Utils/FormatString"
import { ThirdLevelCategory } from "./ThirdLevelCategory"
import { Banner } from "../Banner/Banner"
import { useAvantiMenuDesktop } from "../../../../context/AvantiMenuContext"
import { MenuSeeAllButton } from "../MenuSeeAllButton"
import { Link } from "vtex.render-runtime"

export const SecondLevelCategory = ({ children, title, banner, titleURL, seeAll }: MenuItemsSubLevel) => {

  const css = useCssHandles(CSS_HANDLES)
  const { props } = useAvantiMenuDesktop()
  const newChildren: CategoriesSubmenu[] | undefined = props.secondMaxItems ? children?.slice(0, props.secondMaxItems) : children

  return (
    <>
      {newChildren?.length || (banner?.length && props.banners) ?
        <div className={css['desktop-menuSecondItemsWrapper']}>
          <MenuItemsTitle url={titleURL} modifier={'Second'}>{title}</MenuItemsTitle>
          {seeAll && <MenuSeeAllButton url={titleURL} modifier={'Second'} />}
          <div className={css['desktop-menuSecondItemsContainer']}>
            <ul className={css['desktop-menuSecondItems']}>
              {newChildren?.map(({ id, name, title, children, href }) => (
                <li key={id}
                  className={applyModifiers(css['desktop-menuSecondItem'], [
                    FormatText(name),
                    children.length ? 'hasChildren' : ''
                  ]
                  )}
                >
                  <Link to={href}
                    title={title || name}
                    className={applyModifiers(css['desktop-menuSecondItemLink'], [
                      FormatText(name),
                      children.length ? 'hasChildren' : ''
                    ]
                    )}
                  >
                    {name} {children.length && props.thirdDef ? <MenuArrow /> : ''}
                  </Link>
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
            {(banner?.length && props.banners) ? <Banner banner={banner} alt={title} /> : ''}
          </div>
        </div>
        : ''}
    </>
  )
}
