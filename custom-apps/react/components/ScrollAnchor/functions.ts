// Se for necessário ajustar a altura que o conteúdo sobe, alterar em "top". O valor '10' é um 'margin-top'.

export const WindowScroll = (elHeader: any, elAnchor: any) => {
  const elBody = document.querySelector('body') as HTMLElement

  const total = (Math.abs(elBody.getBoundingClientRect().top) + Math.abs(elAnchor.getBoundingClientRect().top)) - elHeader.clientHeight

  window.scroll({
    top: total - 10,
    behavior: 'smooth',
  })
}

// Se a classe do header não estiver correta, alterar em "heightSticky".

export const FindElements = (selector: string) => {
  const objectElements = {
    elAnchor: document.querySelector(selector) as HTMLElement,
    elHeader: document.querySelector('.vtex-sticky-layout-0-x-container') as HTMLElement
  }

  return objectElements
}
