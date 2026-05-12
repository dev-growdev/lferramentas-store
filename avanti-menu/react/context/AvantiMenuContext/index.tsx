import { createContext, useContext } from 'react'
import { AvantiMenuContextProps, AvantiMenuDesktopContextStateProps, AvantiMenuMobileContextStateProps } from '../../typings/types'


const defaultMenuDesktop: AvantiMenuDesktopContextStateProps = {
  props: {
    departmentDef: true,
    department: "Departamentos",
    banners: true,
    bannerSize: {
      width: "274",
      height: "274"
    },
    menuType: "theme1"
  },
  disabledScroll: false,
  setDisabledScroll: () => false
}

const defaultMenuMobile: AvantiMenuMobileContextStateProps = {
  props: {
    menuType: 'theme1'
  },
  open: false,
  setOpen: () => false
}

export const AvantiMenuContext = createContext<AvantiMenuContextProps>({ items: [], categories: [] })
export const useAvantiMenu = () => useContext(AvantiMenuContext)

export const AvantiMenuMobileContext = createContext<AvantiMenuMobileContextStateProps>(defaultMenuMobile)
export const useAvantiMenuMobile = () => useContext(AvantiMenuMobileContext)

export const AvantiMenuDesktopContext = createContext<AvantiMenuDesktopContextStateProps>(defaultMenuDesktop)
export const useAvantiMenuDesktop = () => useContext(AvantiMenuDesktopContext)
