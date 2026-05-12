import { FindElements, WindowScroll } from "./functions"

export function ExecutarScroll(selector: string, navigateTo: string, navigate: (options: any) => boolean) {

  if (navigateTo) {
    navigate({
      to: navigateTo,
    })

    const waitElements = setInterval(() => {
      const { elAnchor, elHeader } = FindElements(selector)

      if (elHeader && elAnchor) {
        clearInterval(waitElements)

        WindowScroll(elHeader, elAnchor)
      }
    }, 1000)


  } else {
    const { elAnchor, elHeader } = FindElements(selector)
    WindowScroll(elHeader, elAnchor)
  }
}
