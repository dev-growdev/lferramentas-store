import React from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { MenuItemsFirstLevel } from "../../../../typings/types"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { MenuArrow } from "../MenuArrow"
import { SecondLevelCustom } from "./SecondLevelCustom"
import { toggleClick } from "../../../Utils/toggleClick"
import { FormatText } from "../../../Utils/FormatString"
import { useAvantiMenuMobile } from "../../../../context/AvantiMenuContext"
import { MenuIcon } from "../MenuIcon"
import { Link } from "vtex.render-runtime"

export const FirstLevelCustom = ({ item }: MenuItemsFirstLevel) => {

  const css = useCssHandles(CSS_HANDLES)
  const { props, setOpen } = useAvantiMenuMobile()
  const { __editorItemTitle, url, tagTitle, items, target, highlightMob, seeAll, menuBarIcon, menuIconVisibleOnMobile, color } = item

  return (
    <>
      {item &&
        <li className={applyModifiers(css['mobile-menuItem'], [
          FormatText(__editorItemTitle),
          items?.length ? 'hasChildren' : '',
          highlightMob ? 'highlightMob' : ''
        ]
        )}
        >
          {items?.length && props.secondDef ?
            (
              <button
                type="button"
                onClick={(event) => toggleClick(event, css['mobile-menuItem--Opened'])}
                title={tagTitle || __editorItemTitle}
                className={applyModifiers(css['mobile-menuItemLink'], [
                  FormatText(__editorItemTitle),
                  items?.length ? 'hasChildren' : '',
                  highlightMob ? 'highlight' : ''
                ]
                )}
              >
                <span className={css['mobile-menuItemLinkText']} style={{ color: color ?? color }}>
                  {menuIconVisibleOnMobile && <MenuIcon src={menuBarIcon} alt={__editorItemTitle} />}
                  {__editorItemTitle}
                </span>
                <MenuArrow fill={color} />
              </button>
            ) :
            (
              <Link
                onClick={() => setOpen(false)}
                to={items?.length && props.secondDef ? undefined : `${url || ''}`}
                title={tagTitle || __editorItemTitle}
                target={target ? "_blank" : "_self"}
                className={applyModifiers(css['mobile-menuItemLink'], [
                  FormatText(__editorItemTitle),
                  highlightMob ? 'highlight' : ''
                ]
                )}
              >
                <span className={css['mobile-menuItemLinkText']} style={{ color: color ?? color }}>
                  {menuIconVisibleOnMobile && <MenuIcon src={menuBarIcon} alt={__editorItemTitle} />}
                  {__editorItemTitle}
                </span>
              </Link>
            )}
          {items?.length && props.secondDef ?
            <SecondLevelCustom
              items={items}
              title={__editorItemTitle}
              titleURL={`${url || ''}`}
              seeAll={seeAll}
            />
            : ''}
        </li>
      }
    </>
  )
}
