import React from 'react'
import { Link } from 'vtex.render-runtime'
import PropTypes from 'prop-types'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['customLink'] as const

interface CustomLinkProps {
  to: string
  text: string
  openInNewTab?: boolean
  noFollow?: boolean
  blockClass?: string
  analyticsProperties?: 'none' | 'provide'
  promotionId?: string
  promotionName?: string
  promotionPosition?: string
}

const isExternal = (url: string) => /^https?:\/\//.test(url)

const CustomLink = ({
  to,
  text,
  openInNewTab = false,
  noFollow = false,
  blockClass = '',
  analyticsProperties = 'none',
  promotionId = '',
  promotionName = '',
  promotionPosition = '',
}: CustomLinkProps) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  const handleClick = () => {
    if (analyticsProperties !== 'provide' || typeof window == 'undefined') {
      return
    }

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'click_atacado_header',
      ecommerce: {
        promotionId,
        promotionName,
        promotionPosition,
      },
    })
  }

  const className = `${handles.customLink}${blockClass ? ` ${blockClass}` : ''}`

  if (isExternal(to)) {
    return (
      <a
        href={to}
        target={openInNewTab ? '_blank' : undefined}
        rel={noFollow ? 'nofollow' : undefined}
        className={className}
        onClick={handleClick}
      >
        {text}
      </a>
    )
  }

  return (
    <Link
      to={to}
      target={openInNewTab ? '_blank' : undefined}
      rel={noFollow ? 'nofollow' : undefined}
      className={className}
      onClick={handleClick}
    >
      {text}
    </Link>
  )
}

CustomLink.schema = {
  title: 'Custom Link',
  description: 'A customizable link component',
  type: 'object',
  properties: {
    to: {
      title: 'URL',
      type: 'string',
      default: '/',
    },
    text: {
      title: 'Text',
      type: 'string',
      default: 'Clique aqui',
    },
    openInNewTab: {
      title: 'Abrir em nova aba',
      type: 'boolean',
      default: false,
    },
    noFollow: {
      title: 'No Follow',
      type: 'boolean',
      default: false,
    },
    blockClass: {
      title: 'Classe customizada',
      type: 'string',
      default: '',
    },
    analyticsProperties: {
      title: 'Evento do Analytics',
      enum: ['none', 'provide'],
      enumNames: [
        'admin/editor.image.analytics.none',
        'admin/editor.image.analytics.provide',
      ],
      widget: {
        'ui:widget': 'radio',
      },
      default: 'none',
    },
  },
  dependencies: {
    analyticsProperties: {
      oneOf: [
        {
          properties: {
            analyticsProperties: {
              enum: ['provide'],
            },
            promotionId: {
              title: 'admin/editor.image.analytics.promotionId',
              type: 'string',
              default: '',
            },
            promotionName: {
              title: 'admin/editor.image.analytics.promotionName',
              type: 'string',
              default: '',
            },
            promotionPosition: {
              title: 'admin/editor.image.analytics.promotionPosition',
              type: 'string',
              default: '',
            },
          },
        },
        {
          properties: {
            analyticsProperties: {
              enum: ['none'],
            },
          },
        },
      ],
    },
  },
}

CustomLink.propTypes = {
  to: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  openInNewTab: PropTypes.bool,
  noFollow: PropTypes.bool,
  blockClass: PropTypes.string,
  analyticsProperties: PropTypes.oneOf(['none', 'provide']),
  promotionId: PropTypes.string,
  promotionName: PropTypes.string,
  promotionPosition: PropTypes.string,
}

export default CustomLink
