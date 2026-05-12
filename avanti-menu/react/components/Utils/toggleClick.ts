import { MouseEvent } from "react"

export const toggleClick = (event: MouseEvent, css: string) => {
  event.persist()
  event.currentTarget.parentElement?.classList.toggle(css)
}