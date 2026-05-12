import React from 'react'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

const CSS_HANDLES = ['skeleton'] as const

type Props = {
  blockClass?: string
}

const Skeleton: React.FC<Props> = ({ blockClass = '' }) => {
  const handles = useCssHandles(CSS_HANDLES)

  return <div className={applyModifiers(handles.skeleton, [blockClass])} />
}

export default Skeleton
