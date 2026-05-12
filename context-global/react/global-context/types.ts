import { GlobalUseContextProps } from "../global-context/contexts/global-context-type-avanti-inst-menu/index"

export interface GlobalSiteEditorProps {
  instMenu: [GlobalUseContextProps]
  enableBlackFridayStyles: boolean
  children: any
  FlagsAppContext: any
}

export interface GlobalProviderProps {
  instMenu: GlobalUseContextProps 
}
