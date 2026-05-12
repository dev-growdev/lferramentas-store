import React from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { MenuArrow } from "../../Menu/MenuArrow"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { toggleClick } from "../../../Utils/toggleClick"
import { SubItems } from "./SubItems"
import { AvantiMenuMobileContextItemProps } from "../../../../typings/types"
import { FormatText } from "../../../Utils/FormatString"
import { Link } from "vtex.render-runtime"

declare global {
  interface Window {
    dataLayer?: any[];
  }
}

export const NormalItem = ({ item }: AvantiMenuMobileContextItemProps) => {

  const css = useCssHandles(CSS_HANDLES)

  const handleClick = () => {
    if (item.analyticsProperties !== 'provide' || typeof window == 'undefined') {
      return
    }
    
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'click_atacado_header',
      ecommerce: {
        promotionId: item.promotionId,
        promotionName: item.promotionName,
        promotionPosition: item.promotionPosition,
      },
    })
  }

  const isExternal = typeof item.url === 'string' && item.url.startsWith('http')

  const linkContent = (
    <>
      <span className={css["mobile-itemTextContent"]}>
        {(item.icon && item.iconDef) &&
          <img width={25} height={25} alt={item.__editorItemTitle} src={item.icon} className={css["mobile-itemIcon"]} />
        }
        <span className={css["mobile-itemText"]}>{item.__editorItemTitle}</span>
      </span>
      {item.items?.length && item.itemsDef ? <MenuArrow /> : ""}
    </>
  )

  const linkProps = {
    onClick: (event: any) => {
      handleClick()
      toggleClick(event, css["mobile-item--Opened"]);
    },
    className: applyModifiers(css["mobile-itemLink"], FormatText(item.__editorItemTitle)),
  }

  return (
    <li className={applyModifiers(css['mobile-item'], [
      FormatText(item.__editorItemTitle),
      item.items?.length ? 'hasChildren' : '',
    ])}
    >
      {isExternal ? (
        <a
          href={item.items?.length && item.itemsDef ? undefined : item.url}
          target="_blank"
          rel="noopener noreferrer"
          {...linkProps}
        >
          {linkContent}
        </a>
      ) : (
        <Link
          to={item.items?.length && item.itemsDef ? undefined : item.url}
          {...linkProps}
        >
          {linkContent}
        </Link>
      )}
      {item.items?.length && item.itemsDef ? <SubItems items={item.items} /> : ""}
    </li>
  )
}
