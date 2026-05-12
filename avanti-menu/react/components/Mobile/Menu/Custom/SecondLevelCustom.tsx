import React from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { MenuItemsSecond, MenuItemsSubLevel } from "../../../../typings/types"
import { FormatText } from "../../../Utils/FormatString"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { MenuArrow } from "../MenuArrow"
import { MenuBackButton } from "../MenuBackButton"
import { MenuItemsTitle } from "../MenuItemsTitle"
import { MenuItemsTitleContent } from "../MenuItemsTitleContent"
import { MenuSeeAllButton } from "../MenuSeeAllButton"
import { toggleClick } from "../../../Utils/toggleClick"
import { ThirdLevelCustom } from "./ThirdLevelCustom"
import { useAvantiMenu, useAvantiMenuMobile } from "../../../../context/AvantiMenuContext"
import { MenuIcon } from "../MenuIcon"
import { ThirdLevelCategory } from "../Category/ThirdLevelCategory"
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


export const SecondLevelCustom = ({ items, title, titleURL, seeAll }: MenuItemsSubLevel) => {

  const css = useCssHandles(CSS_HANDLES)
  const { props, setOpen } = useAvantiMenuMobile()
  const newItems: MenuItemsSecond[] | undefined = props.secondMaxItems ? items?.slice(0, props.secondMaxItems) : items
  const { categories } = useAvantiMenu()
  const getChildren = (categoryId: number) => {
    if (categoryId) {
      const categoriesFind = categories?.find(
        category => category.id === categoryId
      )

      const subCategoriesFind = categories.map(categoryFirst => {
        return categoryFirst.children.find(
          (sub: Categories) => sub.id === categoryId
        )
      })

      const finalSubcategory = subCategoriesFind.filter(Boolean)

      if (categoriesFind) {
        return categoriesFind
      }

      if (finalSubcategory.length > 0) {
        return finalSubcategory[0]
      }
    }
    return
  }

  return (
    <div className={css['mobile-menuSecondItemsWrapper']}>
      <MenuItemsTitleContent>
        <MenuBackButton remove={css['mobile-menuItem--Opened']} />
        <MenuItemsTitle url={titleURL} modifier={'Second'}>{title}</MenuItemsTitle>
      </MenuItemsTitleContent>
      {seeAll && <MenuSeeAllButton url={titleURL} modifier={'Second'} />}
      <ul className={css['mobile-menuSecondItems']}>
        {newItems?.map(({ __editorItemTitle, items, mobile, tagTitle, url, target, highlightMob, seeAll, menuBarIconDef, menuBarIcon, menuIconVisibleOnMobile, color, categoryId }, index) => (
          mobile &&
          <li key={index}
            className={applyModifiers(css['mobile-menuSecondItem'], [
              FormatText(__editorItemTitle),
              items?.length ? 'hasChildren' : '',
              highlightMob ? 'highlightMob' : ''
            ]
            )}
          >

            {items?.length && props.thirdDef || getChildren(categoryId as number)?.children ? (
              <button
                type="button"
                title={tagTitle || __editorItemTitle}
                className={applyModifiers(css['mobile-menuSecondItemLink'], [
                  FormatText(__editorItemTitle),
                  items?.length ? 'hasChildren' : '',
                  highlightMob ? 'highlight' : ''
                ]
                )}
                onClick={(event) => toggleClick(event, css['mobile-menuSecondItem--Opened'])}
              >
                <span className={css['mobile-menuSecondItemLinkText']} style={{ color: color ?? color }}>
                  {menuBarIconDef && menuIconVisibleOnMobile && < MenuIcon src={menuBarIcon} />}
                  {__editorItemTitle}
                </span>
                {items?.length && props.thirdDef || getChildren(categoryId as number)?.children ? <MenuArrow fill={color} /> : ''}
              </button>
            ) : (
              <Link
              onClick={() => setOpen(false)} 
              to={items?.length && props.thirdDef || getChildren(categoryId as number)?.children ? undefined : !getChildren(categoryId as number)?.children ? getChildren(categoryId as number)?.url : `${titleURL}${url || ''}`}
                target={target ? "_blank" : "_self"}
                title={tagTitle || __editorItemTitle}
                className={applyModifiers(css['mobile-menuSecondItemLink'], [
                  FormatText(__editorItemTitle),
                  highlightMob ? 'highlight' : ''
                ]
                )}
              >
                <span className={css['mobile-menuSecondItemLinkText']} style={{ color: color ?? color }}>
                  {menuBarIconDef && menuIconVisibleOnMobile && < MenuIcon src={menuBarIcon} />}
                  {__editorItemTitle}
                </span>
                {items?.length && props.thirdDef || getChildren(categoryId as number)?.children ? <MenuArrow fill={color} /> : ''}
              </Link>
            )}

            {props.thirdDef && !categoryId ? (
              <ThirdLevelCustom
                items={items}
                title={__editorItemTitle}
                titleURL={`${titleURL}${url || ''}`}
                seeAll={seeAll}
              />) : (
              <ThirdLevelCategory
                children={getChildren(categoryId as number)?.children}
                title={getChildren(categoryId as number)?.name}
                titleURL={`${getChildren(categoryId as number)?.url}${url || ""}`}
                seeAll={seeAll}
              />
            )}
          </li>
        )
        )}
      </ul>
    </div>
  )
}
