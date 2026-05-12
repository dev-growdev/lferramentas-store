import React from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { MenuItemsSecond, MenuItemsSubLevel } from "../../../../typings/types"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { MenuItemsTitle } from "../MenuItemsTitle"
import { FormatText } from "../../../Utils/FormatString"
import { MenuSeeAllButton } from "../MenuSeeAllButton"
import { useAvantiMenuDesktop } from "../../../../context/AvantiMenuContext"
import { MenuIcon } from "../MenuIcon"
import { Link } from "vtex.render-runtime"

export const ThirdLevelCustom = ({ items, title, titleURL, seeAll }: MenuItemsSubLevel) => {

  const css = useCssHandles(CSS_HANDLES)
  const { props } = useAvantiMenuDesktop()
  const newItems: MenuItemsSecond[] | undefined = props.thirdMaxItems ? items?.slice(0, props.thirdMaxItems) : items

  return (
    <>
      {newItems?.length ?
        <>
          <div className={css['desktop-menuThirdItemsWrapper']}>
            <MenuItemsTitle url={titleURL} modifier={'Third'}>{title}</MenuItemsTitle>
            {seeAll && <MenuSeeAllButton url={titleURL} modifier={'Third'} />}
            <ul className={css['desktop-menuThirdItems']}>
              {newItems.map(({ __editorItemTitle, desktop, url, tagTitle, highlightDesk, menuBarIconDef, menuBarIcon, menuIconVisibleOnDesktop, color }) => (
                desktop &&
                <li key={__editorItemTitle}
                  className={applyModifiers(css['desktop-menuThirdItem'], [
                    FormatText(__editorItemTitle),
                    highlightDesk ? 'highlightDesk' : ''
                  ])}
                >
                  <Link to={`${titleURL}${url || ''}`}
                    title={tagTitle || __editorItemTitle}
                    className={applyModifiers(css['desktop-menuThirdItemLink'], [
                      FormatText(__editorItemTitle),
                      highlightDesk ? 'highlightDesk' : '',
                    ])}
                  >
                    <span className={css['desktop-menuThirdItemLinkText']} style={{ color: color ?? color }}>
                      {menuBarIconDef && menuIconVisibleOnDesktop && <MenuIcon src={menuBarIcon} />}
                      {__editorItemTitle}
                    </span>
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
