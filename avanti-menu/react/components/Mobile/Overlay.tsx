import React from 'react'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { useAvantiMenuMobile } from '../../context/AvantiMenuContext'
import { CSS_HANDLES } from './CSS_HANDLES'

export const Overlay = () => {

  const { open, setOpen } = useAvantiMenuMobile()
  const css = useCssHandles(CSS_HANDLES)

  return (
    <div  onClick={()=> setOpen(false)} className={applyModifiers(css['mobile-overlay'], open ? 'Opened' : '')}>
    </div>
  )
}
