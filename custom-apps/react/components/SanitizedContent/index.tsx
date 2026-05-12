import React from 'react'
import { SanitizedHTML } from 'vtex.store-components'

type Props = {
  content: string
}

const allowedTags = [
  'a',
  'abbr',
  'article',
  'b',
  'blockquote',
  'br',
  'caption',
  'code',
  'del',
  'details',
  'div',
  'em',
  'figure',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'header',
  'footer',
  'i',
  'img',
  'ins',
  'iframe',
  'kbd',
  'li',
  'main',
  'mark',
  'ol',
  'p',
  'picture',
  'pre',
  'section',
  'source',
  'span',
  'strike',
  'strong',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'u',
  'ul',

  'link',
  'body',
  'html',
  'style',
  'link',
  'script',
  'head',
  'meta',
  'object',
  'embed',
]

const allowedAttributes = {
  '*': [
    'id',
    'title',
    'accesskey',
    'class',
    'style',
    'aria-label',
    'width',
    'height',
    'hidden',
  ],
  a: ['href', 'name', 'target'],
  iframe: ['allow', 'allowfullscreen', 'frameborder', 'src'],
  img: ['src', 'alt'],
  link: ['rel', 'type', 'href'],
  td: ['colspan', 'rowspan', 'headers'],

  meta: ['charset', 'name', 'content'],
  object: ['type', 'height', 'width', 'data'],
  embed: ['height', 'width', 'src'],
}

const SanitizedContent: React.FC<Props> = ({ content }) => {
  return (
    <SanitizedHTML
      content={content}
      allowedTags={allowedTags}
      allowedAttributes={allowedAttributes} />
  )
}

export default SanitizedContent
