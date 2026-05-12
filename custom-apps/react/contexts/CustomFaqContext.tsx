import { createContext, useContext } from 'react'
import { CustomFaqContextProps } from '../typings/types'


const defaultMenuMobile: CustomFaqContextProps = {
    questions: [],
    direction: "row",
    justify: "space-between",
    align: "center",
    closePrev: false,
    icon: null,
    iconColor: "#000"
}

export const CustomFaqContext = createContext<CustomFaqContextProps>(defaultMenuMobile)
export const useCustomFaq = () => useContext(CustomFaqContext)