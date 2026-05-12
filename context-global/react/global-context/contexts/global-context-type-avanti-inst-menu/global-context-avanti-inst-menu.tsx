import React from "react"
import { GlobalUseContextProps } from "./index"

export const GlobalContextAvantiInstMenu = React.createContext<GlobalUseContextProps>({} as any)

export const useGlobalContextAvantiInstMenu = () => {
  return React.useContext<GlobalUseContextProps>(GlobalContextAvantiInstMenu)
}
