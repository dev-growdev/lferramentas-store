import React from 'react'
import { MenuItems } from './Menu/MenuItems'
import { ChangeTheme } from './ChangeTheme'

export const MenuDesktop = () => {

  return (
    <ChangeTheme>
      <MenuItems />
    </ChangeTheme>
  )
}