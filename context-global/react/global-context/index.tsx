import React from 'react'
import { SchemaSiteEditor } from './cms-helper'
import { GlobalProviderProps, GlobalSiteEditorProps } from './types'
import { GlobalContextAvantiInstMenu } from './contexts/global-context-type-avanti-inst-menu/global-context-avanti-inst-menu'
import { GlobalContextSchemaAvantiInstMenu } from './contexts/global-context-type-avanti-inst-menu/schema'

export const GlobalContext = React.createContext<GlobalProviderProps>({} as any)

export const GlobalProvider = ({
  FlagsAppContext,
  ...props
}: GlobalSiteEditorProps) => {

  return (
    <GlobalContext.Provider value={null as any}>
      <GlobalContextAvantiInstMenu.Provider
        value={props?.instMenu?.[0] ?? null}
      >
        <FlagsAppContext>
          <div className={props?.enableBlackFridayStyles ? 'black-friday' : ''}>
            {props.children}
          </div>
        </FlagsAppContext>
      </GlobalContextAvantiInstMenu.Provider>
    </GlobalContext.Provider>
  )
}

GlobalProvider.schema = {
  title: 'Configurações globais',
  type: 'object',
  properties: {
    instMenu: {
      type: 'array',
      maxItems: 1,
      title: 'Configurar Menu das Páginas Institucionais',
      items: GlobalContextSchemaAvantiInstMenu(),
    },
    enableBlackFridayStyles: {
      type: 'boolean',
      title: 'Ativar estilos Black Friday',
      default: false,
    },
  },
} as SchemaSiteEditor
