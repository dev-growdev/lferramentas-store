import React from 'react'
import { Link } from 'vtex.render-runtime'

import useProductProperty from '../../hooks/useProductProperty'
import getSpecificationValue from '../../utils/getSpecificationValue'
import { useCssHandles } from 'vtex.css-handles'

type Props = {
  blockClass?: string | string[]
  propertyName?: string
}

const CSS_HANDLES = ['propertyLink'] as const

const ProductPropertyLink: React.FC<Props> = ({
  propertyName = '',
  children,
}) => {

  const { handles } = useCssHandles(CSS_HANDLES)
  const property = useProductProperty(propertyName)

  const propertyValue = getSpecificationValue(property)

  if (propertyValue === null) return null

  const childrenCount = React.Children.count(children)
  const noChildren = childrenCount <= 0

  return (
    <Link to={propertyValue} target="_blank" className={handles.propertyLink}>
      {noChildren ? propertyValue : children}
    </Link>
  )
}

export default ProductPropertyLink
