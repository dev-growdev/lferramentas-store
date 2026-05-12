import React from "react"
import { CustomFaqContext } from "./contexts/CustomFaqContext"
import CustomFaqQuestions from "./components/CustomFaq/index"
import { CustomFaqContextProps } from "./typings/types"

export const CustomFaq = ({
  questions,
  direction,
  justify,
  align,
  closePrev,
  icon,
  iconColor,
}: CustomFaqContextProps) => {
  return (
    <CustomFaqContext.Provider value={{ questions, direction, justify, align, closePrev, icon, iconColor }}>
      <CustomFaqQuestions />
    </CustomFaqContext.Provider>
  )
}

CustomFaq.schema = {
  title: "admin/editor.custom-faq.title",
}

export default CustomFaq
