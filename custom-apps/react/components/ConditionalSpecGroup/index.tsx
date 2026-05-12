import React from 'react'

import useProductSpecGroup from '../../hooks/useProductSpecGroup'
import { useCssHandles } from 'vtex.css-handles'

type Props = {
  blockClass?: string | string[]
  propertyName?: string
}

const CSS_HANDLES = ['specGroupContainer'] as const

const ConditionalSpecGroup: React.FC<Props> = ({
  propertyName = '',
  children,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const specGroup = useProductSpecGroup(propertyName)

  return (<>
    {
      !!specGroup ?
        <div className={handles.specGroupContainer}>{children}</div> :
        null
    }
  </>
  )
}

export default ConditionalSpecGroup
