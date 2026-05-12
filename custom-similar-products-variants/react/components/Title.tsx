import React from 'react'
import { useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['title'] as const

const Title: React.FC = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const intl = useIntl()

  return (
    <p className={`${handles.title}`}>
      {intl.formatMessage({ id: 'store/title.label' })}
    </p>
  )
}

export default Title
