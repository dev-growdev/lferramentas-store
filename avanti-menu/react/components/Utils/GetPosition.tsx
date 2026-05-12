import { MouseEvent } from "react"

export const GetPosition = (event: MouseEvent, css: string) => {
  const width = Math.max( document.documentElement.clientWidth || 0, window.innerWidth || 0 )
  const elementPosition = event.clientX > (width/2)
  elementPosition && event.currentTarget.classList.add(css)
}
