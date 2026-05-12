import React, { useEffect, useState } from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { useAvantiMenu, useAvantiMenuDesktop } from "../../../../context/AvantiMenuContext"
import { CategoriesMenu, IndexItemsLevel, MenuItemsFirstLevel } from "../../../../typings/types"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { MenuArrow } from "../MenuArrow"
import { MenuIcon } from "../MenuIcon"
import { FormatText } from "../../../Utils/FormatString"
import { SecondLevelCategory } from "./SecondLevelCategory"
import { Link } from "vtex.render-runtime"

type Categories = {
  id?: number
  name?: string
  hasChildren?: boolean
  url?: string
  children?: Categories[] | undefined
  Title?: string
  MetaTagDescription?: string
}

export const FirstLevelCategory = ({ item, index }: MenuItemsFirstLevel & IndexItemsLevel) => {

  const [category, setCategory] = useState<CategoriesMenu>()
  const { categories } = useAvantiMenu()
  const { props } = useAvantiMenuDesktop()
  const css = useCssHandles(CSS_HANDLES)
  const { __editorItemTitle, tagTitle, onMouseHover, target, menuBarIcon, menuIconVisibleOnDesktop, banner, hasName, seeAll, highlightDesk, color } = item

  useEffect(() => {
    setCategory(categories?.find(category => category.id === item?.categoryId))
    if (!categories?.find(category => category.id === item?.categoryId)) {
      categories.map(categoryFirst => {
        const categoryChild = categoryFirst.children.find(
          (sub: Categories) => sub.id === item?.categoryId
        )
        if (categoryChild) {
          setCategory(categoryChild)
        }
      })
    }
  }, [categories, setCategory, item])




  return (
    <>
      <li className={applyModifiers(
        css['desktop-menuItem'], [
        FormatText(category ? category.name : ''),
        highlightDesk ? 'highlightDesk' : '',
        category?.children.length ? 'hasChildren' : '',
        !category?.children.length && banner ? 'bannerOnly' : '',
        index ? `child-${index}` : ''
      ]
      )}
      >
        <Link to={category?.href}
          title={hasName ? category?.title : tagTitle}
          target={target ? "_blank" : "_self"}
          className={applyModifiers(css['desktop-menuItemLink'], [
            FormatText(category ? category.name : ''),
            category?.children.length ? 'hasChildren' : '',
            item.highlightDesk ? 'highlightDesk' : ''
          ]
          )}
        >
          {menuIconVisibleOnDesktop ? <MenuIcon src={menuBarIcon} /> : ""}
          <span className={css['desktop-menuItemLinkText']} style={{ color: color ?? color }}>
            {hasName ? category?.name : __editorItemTitle}
            {category?.children.length && props.secondDef ? <MenuArrow fill={color} /> : ''}
          </span>
        </Link>
        {onMouseHover && props.secondDef ?
          <SecondLevelCategory
            children={category?.children}
            title={hasName ? category?.name : __editorItemTitle}
            titleURL={category?.href}
            banner={banner}
            seeAll={seeAll}
          />
          : ''}
      </li>
    </>
  )
}
