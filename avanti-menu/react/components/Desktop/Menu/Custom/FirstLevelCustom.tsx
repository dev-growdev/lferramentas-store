import React from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { IndexItemsLevel, MenuItemsFirstLevel } from "../../../../typings/types"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { MenuArrow } from "../MenuArrow"
import { SecondLevelCustom } from "../Custom/SecondLevelCustom"
import { MenuIcon } from "../MenuIcon"
import { FormatText } from "../../../Utils/FormatString"
import { useAvantiMenuDesktop } from "../../../../context/AvantiMenuContext"
import { Link } from "vtex.render-runtime"

export const FirstLevelCustom = ({ item, index }: MenuItemsFirstLevel & IndexItemsLevel) => {

  const css = useCssHandles(CSS_HANDLES)
  const { __editorItemTitle, url, tagTitle, items, onMouseHover, target, menuBarIcon, menuIconVisibleOnDesktop, banner, highlightDesk, seeAll, color } = item
  const { props, setDisabledScroll } = useAvantiMenuDesktop()

  const mouseOver = () => {
    setDisabledScroll(true)
  }

  const mouseOut = () => {
    setDisabledScroll(false)
  }

  return (
    <>
      <li className={applyModifiers(css['desktop-menuItem'], [
        FormatText(__editorItemTitle),
        highlightDesk ? 'highlightDesk' : '',
        items?.length ? 'hasChildren' : '',
        !items?.length && banner ? 'bannerOnly' : '',
        index ? `child-${index}` : ''
      ]
      )}
      >
        <Link to={url}
          title={tagTitle || __editorItemTitle}
          target={target ? "_blank" : "_self"}
          className={applyModifiers(css['desktop-menuItemLink'], [
            FormatText(__editorItemTitle),
            items?.length ? 'hasChildren' : '',
            highlightDesk ? 'highlightDesk' : ''
          ]
          )}
        >
          {menuIconVisibleOnDesktop ? <MenuIcon src={menuBarIcon} /> : ""}
          <span className={css['desktop-menuItemLinkText']} style={{ color: color ?? color }}>
            {__editorItemTitle}
            {items?.length && props.secondDef ? <MenuArrow fill={color} /> : ''}
          </span>
        </Link>
        {onMouseHover && props.secondDef ?
          <SecondLevelCustom
            items={items}
            title={__editorItemTitle}
            titleURL={url ? url : ''}
            banner={banner}
            seeAll={seeAll}
          />
          : ''}
        <div onMouseOver={mouseOver} onMouseOut={mouseOut} className={css['desktop-overlay']}></div>
      </li>
    </>
  )
}
