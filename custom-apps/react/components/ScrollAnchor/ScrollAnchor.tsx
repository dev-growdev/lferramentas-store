import React from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { ExecutarScroll } from './ExecutarScroll'

interface props {
  navigateTo: string,
  link: string,
  anchor: string
}

export default function ScrollAnchor({ navigateTo, link, anchor }: props) {
  const { navigate } = useRuntime()

  const waitLinkAndAnchor = setInterval(() => {
    let classLink = document.querySelector(link)

    if (anchor && classLink) {
      clearInterval(waitLinkAndAnchor)
      classLink.addEventListener("click", () => { ExecutarScroll(anchor, navigateTo, navigate) })
    }
  }, 1000)

  return <></>
}
