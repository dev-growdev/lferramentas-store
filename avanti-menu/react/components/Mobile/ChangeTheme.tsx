import React from 'react'
import { useAvantiMenuMobile } from '../../context/AvantiMenuContext'
import { AvantiMenuChildrenProps } from '../../typings/types'
import { useCssHandles } from 'vtex.css-handles'
import { CSS_HANDLES } from './CSS_HANDLES'

export const ChangeTheme = ({ children }: AvantiMenuChildrenProps) => {

  const { props } = useAvantiMenuMobile()
  const theme = useCssHandles(CSS_HANDLES)[props.menuType]

  return (
    <div className={theme}>
        {children}
    </div>
  )
}
