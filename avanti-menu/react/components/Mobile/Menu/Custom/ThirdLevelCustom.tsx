import React from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { useAvantiMenuMobile } from "../../../../context/AvantiMenuContext"
import { MenuItemsSecond, MenuItemsSubLevel } from "../../../../typings/types"
import { FormatText } from "../../../Utils/FormatString"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { MenuBackButton } from "../MenuBackButton"
import { MenuIcon } from "../MenuIcon"
import { MenuItemsTitle } from "../MenuItemsTitle"
import { MenuItemsTitleContent } from "../MenuItemsTitleContent"
import { MenuSeeAllButton } from "../MenuSeeAllButton"
import { Link } from "vtex.render-runtime"

export const ThirdLevelCustom = ({ items, title, titleURL, seeAll }: MenuItemsSubLevel) => {

  const css = useCssHandles(CSS_HANDLES)
  const { props, setOpen } = useAvantiMenuMobile()
  const newItems: MenuItemsSecond[] | undefined = props.thirdMaxItems ? items?.slice(0, props.thirdMaxItems) : items

  return (
    <>
      {newItems?.length ?
        <div className={css['mobile-menuThirdItemsWrapper']}>
          <MenuItemsTitleContent>
            <MenuBackButton remove={css['mobile-menuSecondItem--Opened']} />
            <MenuItemsTitle url={titleURL} modifier={'Third'}>{title}</MenuItemsTitle>
          </MenuItemsTitleContent>
          {seeAll && <MenuSeeAllButton url={titleURL} modifier={'Third'} />}
          <ul className={css['mobile-menuThirdItems']}>
            {newItems?.map(({ __editorItemTitle, mobile, url, tagTitle, target, highlightMob, menuBarIconDef, menuBarIcon, menuIconVisibleOnMobile, color }, index) =>
              mobile && (
                <li key={index}
                  className={applyModifiers(css['mobile-menuThirdItem'], [
                    FormatText(__editorItemTitle),
                    highlightMob ? 'highlightMob' : ''
                  ])}
                >
                  <Link
                  onClick={() => setOpen(false)} 
                  to={`${titleURL}${url || ''}`}
                    title={tagTitle || __editorItemTitle}
                    target={target ? "_blank" : "_self"}
                    className={applyModifiers(css['mobile-menuThirdItemLink'], [
                      FormatText(__editorItemTitle),
                      highlightMob ? 'highlightMob' : ''
                    ])}
                  >
                    <span className={css['mobile-menuSecondItemLinkText']} style={{ color: color ?? color }}>
                      {menuBarIconDef && menuIconVisibleOnMobile && <MenuIcon src={menuBarIcon} />}
                      {__editorItemTitle}
                    </span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
        : ''}
    </>
  )
}
