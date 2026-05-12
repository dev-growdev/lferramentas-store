import React, { useEffect, useState } from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { useAvantiMenu, useAvantiMenuMobile } from "../../../../context/AvantiMenuContext"
import { CategoriesMenu, MenuItemsFirstLevel } from "../../../../typings/types"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { MenuArrow } from "../MenuArrow"
import { toggleClick } from "../../../Utils/toggleClick"
import { SecondLevelCategory } from "./SecondLevelCategory"
import { FormatText } from "../../../Utils/FormatString"
import { MenuIcon } from "../MenuIcon"
import { Link } from "vtex.render-runtime"

export const FirstLevelCategory = ({ item }: MenuItemsFirstLevel) => {

  const [category, setCategory] = useState<CategoriesMenu>()
  const { categories } = useAvantiMenu()
  const { props } = useAvantiMenuMobile()
  const css = useCssHandles(CSS_HANDLES)
  const { __editorItemTitle, tagTitle, target, hasName, seeAll, highlightMob, categoryId, menuBarIcon, menuIconVisibleOnMobile, color } = item

  useEffect(() => {
    setCategory(categories.find((category) => category.id === categoryId))
  }, [categories, setCategory, categoryId])

  return (
    <>
      {category &&
        <li className={applyModifiers(css['mobile-menuItem'], [
          FormatText(__editorItemTitle),
          category.children.length ? 'hasChildren' : '',
          highlightMob ? 'highlightMob' : ''
        ]
        )}
        >
          {category.children.length && props.secondDef ?
            (
              <button
                type="button"
                onClick={(event) => toggleClick(event, css['mobile-menuItem--Opened'])}
                title={hasName ? category?.title : tagTitle}
                className={applyModifiers(css['mobile-menuItemLink'], [
                  FormatText(category ? category.name : ''),
                  category.children.length ? 'hasChildren' : '',
                  highlightMob ? 'highlight' : ''
                ]
                )}
              >
                <span className={css['mobile-menuItemLinkText']} style={{ color: color ?? color }}>
                  {menuIconVisibleOnMobile && <MenuIcon src={menuBarIcon} alt={hasName ? category.name : __editorItemTitle} />}
                  {hasName ? category.name : __editorItemTitle}
                </span>
                <MenuArrow fill={color} />
              </button>
            ) : (
              <Link
                to={category?.href}
                title={hasName ? category?.title : tagTitle}
                target={target ? "_blank" : "_self"}
                className={applyModifiers(css['mobile-menuItemLink'], [
                  FormatText(category ? category.name : ''),
                  highlightMob ? 'highlight' : ''
                ]
                )}
              >
                <span className={css['mobile-menuItemLinkText']} style={{ color: color ?? color }}>
                  {menuIconVisibleOnMobile && <MenuIcon src={menuBarIcon} alt={hasName ? category.name : __editorItemTitle} />}
                  {hasName ? category.name : __editorItemTitle}
                </span>
              </Link>
            )}
          {category.children.length && props.secondDef ?
            <SecondLevelCategory
              children={category.children}
              title={hasName ? category.name : __editorItemTitle}
              titleURL={category.href}
              seeAll={seeAll}
            />
            : ''}
        </li>
      }
    </>
  )
}
