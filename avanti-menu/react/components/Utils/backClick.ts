import { MouseEvent } from "react"

export const backClick = (event: MouseEvent, css: string) => {
  event.persist()
  event.currentTarget.parentElement?.parentElement?.parentElement?.classList.remove(css)
}