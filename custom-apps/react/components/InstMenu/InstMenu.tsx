import React from 'react'
import { useRuntime } from 'vtex.render-runtime'
import InstMenuMobile from '../InstMenuMobile/InstMenuMobile'
import InstMenuDesktop from '../InstMenuDesktop/InstMenuDesktop'
import { UseGlobalContextInstMenu } from 'lfmaquinaseferramentas.context-global'
import { ItemInstMenu } from './types'

interface IProps {
  items?: ItemInstMenu[]
}

const InstMenu = ({ items }: IProps) => {
  const context = (UseGlobalContextInstMenu())
  const schemaAppInstitutionalMenuContext = context?.items
  const { deviceInfo } = useRuntime()

  const schema = Array.isArray(items) ? items : schemaAppInstitutionalMenuContext

  return deviceInfo.isMobile ? <InstMenuMobile schema={schema} /> : <InstMenuDesktop schema={schema} />
}

InstMenu.schema = {
  title: 'Menu Institucional',
  type: 'object',
  properties: {
    items: {
      title: 'Itens do menu',
      type: 'array',
      minItems: 0,
      items: {
        type: 'object',
        properties: {
          type: {
            title: 'Escolha uma opção',
            type: 'string',
            enum: ['rota', 'titulo'],
            enumNames: ['Rota', 'Título'],
            default: 'rota',
            widget: {
              'ui:widget': 'radio',
            },
          },
        },
        dependencies: {
          type: {
            oneOf: [
              {
                properties: {
                  type: {
                    enum: ['rota'],
                  },
                  __editorItemTitle: {
                    title: 'Título do Site Editor',
                    type: 'string',
                  },
                  text: {
                    title: 'Texto a ser exibido',
                    type: 'string',
                  },
                  href: {
                    title: 'Redirecionamento do link',
                    type: 'string',
                  },
                },
              },
              {
                properties: {
                  type: {
                    enum: ['titulo'],
                  },
                  __editorItemTitle: {
                    title: 'Título do Site Editor',
                    type: 'string',
                  },
                  text: {
                    title: 'Texto a ser exibido',
                    type: 'string',
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
}

export default InstMenu
