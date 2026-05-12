import classNames from 'classnames'
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useAvantiMenuDesktop } from '../../context/AvantiMenuContext'
import { AvantiMenuChildrenProps } from '../../typings/types'
import { CSS_HANDLES } from './CSS_HANDLES'

export const ChangeTheme = ({ children }: AvantiMenuChildrenProps) => {

  const { props } = useAvantiMenuDesktop()
  const css = useCssHandles(CSS_HANDLES)

  return (
    <nav className={classNames(
      css['desktop-navbar'],
      css[props.menuType]
    )}>
      {children}
    </nav>
  )
}
