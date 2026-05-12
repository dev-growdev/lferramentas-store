import React from 'react'
import SanitizedContent from './components/SanitizedContent'

type Props = {
  content: string
}

const CustomHTMLContent: StorefrontFC<Props> = ({ content }) => {
  return (
    <SanitizedContent
      content={content}
    />
  )
}

CustomHTMLContent.schema = {
  title: "Conteúdo HTML"
}

export default CustomHTMLContent
