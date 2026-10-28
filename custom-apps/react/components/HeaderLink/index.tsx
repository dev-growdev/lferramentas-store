import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'headerLink',
  'headerLinkIconContainer',
  'headerLinkIcon',
  'headerLinkText',
] as const

interface HeaderLinkProps {
  isActive?: boolean
  text?: string
  href?: string
  icon?: string
  openInNewTab?: boolean
  noFollow?: boolean
}

const HeaderLink = ({
  isActive = true,
  text = '',
  href = '',
  icon = '',
  openInNewTab = true,
  noFollow = true,
}: HeaderLinkProps) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  if (!isActive || (!text && !icon)) {
    return null
  }

  const rel = [openInNewTab && 'noopener noreferrer', noFollow && 'nofollow']
    .filter(Boolean)
    .join(' ')

  return (
    <a
      href={href}
      title={text}
      target={openInNewTab ? '_blank' : undefined}
      rel={rel || undefined}
      className={handles.headerLink}
    >
      {icon && (
        <span className={handles.headerLinkIconContainer}>
          <img
            src={icon}
            alt=""
            width={24}
            height={24}
            className={handles.headerLinkIcon}
          />
        </span>
      )}
      {text && <span className={handles.headerLinkText}>{text}</span>}
    </a>
  )
}

HeaderLink.schema = {
  title: 'Link do Header',
  type: 'object',
  properties: {
    isActive: {
      title: 'Exibir link',
      type: 'boolean',
      default: true,
    },
    text: {
      title: 'Texto',
      type: 'string',
      default: '',
    },
    href: {
      title: 'Link',
      type: 'string',
      default: '',
    },
    icon: {
      title: 'Ícone',
      type: 'string',
      default: '',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
    openInNewTab: {
      title: 'Abrir em nova aba',
      type: 'boolean',
      default: true,
    },
    noFollow: {
      title: 'Adicionar rel="nofollow"',
      type: 'boolean',
      default: true,
    },
  },
}

export default HeaderLink
