import React from "react"
export interface AvantiMenuContextProps {
  items: MenuItemsFirst[]
  categories: CategoriesMenu[]
}
export interface AvantiMenuDesktopContextStateProps {
  props: AvantiMenuDesktopContextProps
  disabledScroll: boolean
  setDisabledScroll: React.Dispatch<React.SetStateAction<boolean>>
}

export interface AvantiMenuDesktopContextProps {
  departmentDef: boolean
  departmentIcon?: string | null
  banners: boolean
  department: string
  seeAllButton?: string
  bannerSize: {
    width: string
    height: string
  }
  menuType: string
  secondDef?: boolean
  thirdDef?: boolean
  secondMaxItems?: number
  thirdMaxItems?: number
}
export interface AvantiMenuMobileContextStateProps {
  props: AvantiMenuMobileContextProps
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface AvantiMenuMobileContextProps {
  menuType: string
  burguerIcon?: string | null
  backButton?: string
  seeAllButton?: string
  header?: {
    closeIcon: string | null
    logoutDef?: boolean
    logoutLabel?: string
    title?: string
    items?: AvantiMenuMobileContextItemsProps[]
  }
  footer?: {
    items?: AvantiMenuMobileContextItemsProps[]
  }
  secondDef?: boolean
  thirdDef?: boolean
  secondMaxItems?: number
  thirdMaxItems?: number
}

export interface AvantiMenuMobileContextItemProps {
  item: AvantiMenuMobileContextItemsProps
  isAuthenticated?: boolean
}

export interface AvantiMenuMobileContextItemsProps {
  __editorItemTitle?: string
  url?: string
  href?: string
  loginType?: boolean
  myAcc?: string
  iconDef?: boolean
  itemsDef?: boolean
  icon?: string | null
  items?: AvantiMenuMobileContextItemsProps[]
  analyticsProperties?: 'none' | 'provide'
  promotionId?: string
  promotionName?: string
  promotionPosition?: string
}

export interface AvantiMenuChildrenProps {
  children: React.ReactNode
}

export interface MenuItems {
  items: MenuItemsFirst[]
}

export interface CategoryFirst {
  responsive: string
  type: string
  menuBar: boolean
  menuBarIcon?: string | null
  onMouseHover: boolean
  __editorItemTitle: string
  banner?: MenuBannnerProps[]
  menuIconVisibleOnMobile: boolean
  menuIconVisibleOnDesktop: boolean
}
export interface MenuItemsFirst {
  mobile: boolean
  desktop: boolean
  type: string
  color?: string
  menuBar: boolean
  departmentBar: boolean
  menuBarIcon?: string | null
  menuIconVisibleOnMobile: boolean
  menuIconVisibleOnDesktop: boolean
  onMouseHover: boolean
  __editorItemTitle: string
  url?: string
  href?: string
  items?: MenuItemsSecond[]
  target?: boolean
  tagTitle?: string
  banner?: MenuBannnerProps[]
  categoryId?: number
  hasName?: boolean
  highlightDesk?: boolean
  highlightMob?: boolean
  seeAll?: boolean
}

export interface MenuItemsSecond {
  __editorItemTitle: string
  mobile: boolean
  desktop: boolean
  color?: string
  url?: string
  href?: string
  items?: MenuItemsSecond[]
  target?: boolean
  tagTitle?: string
  highlightDesk?: boolean
  highlightMob?: boolean
  seeAll?: boolean
  menuBarIcon?: string | null
  menuBarIconDef?: boolean
  menuIconVisibleOnMobile: boolean
  menuIconVisibleOnDesktop: boolean
  categoryId?: number
  hasName?: boolean
}
export interface MenuBannnerProps {
  src?: string | null
  link?: string
  target?: boolean
}

export interface IndexItemsLevel {
  index?: number
}

export interface MenuItemsFirstLevel {
  item: MenuItemsFirst
}
export interface MenuItemsSubLevel {
  items?: MenuItemsSecond[] | undefined
  children?: CategoriesSubmenu[] | undefined
  title?: string
  titleURL?: string
  banner?: MenuBannnerProps[]
  seeAll?: boolean
  categoryId?: number
}

export interface CategoriesMenu {
  id: number
  name: string
  hasChildren: boolean
  url: string
  href?: string
  children: CategoriesSubmenu[]
  title: string
}
export interface CategoriesSubmenu {
  id: number
  name: string
  hasChildren: boolean
  url: string
  href?: string
  children: CategoriesSubmenu[]
  title: string
}

export interface OthersProps {
  src?: string | null | undefined
  url?: string | undefined
  href?: string | undefined
  remove?: string
  fill?: string | undefined
  alt?: string | undefined
  modifier?: string | undefined
  banner?: MenuBannnerProps[]
}
