import React from 'react'

const useScrollLock = (className: string, shouldLock: boolean) => {
  React.useLayoutEffect(() => {
    const body = document?.body

    if (!body) return

    body.classList.toggle(className, shouldLock)
  })
}

export default useScrollLock
