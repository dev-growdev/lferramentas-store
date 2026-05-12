import React, { useState } from "react";
import { ItemInstMenu } from "../InstMenu/types"
import { cssHandles } from "../InstMenuDesktop/handles";
import { useCssHandles, applyModifiers } from "vtex.css-handles";

interface IProps {
  schema: ItemInstMenu[]
}

const InstMenuMobile = ({ schema }: IProps) => {
  const { handles: css } = useCssHandles(cssHandles)

  const MenuIcon = () => (
    <svg className={applyModifiers(css['icon'], ['instmenumobile', 'toggle-state-isopen'])} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.87793 5.64282C4.62201 5.64282 4.36609 5.54909 4.17082 5.36164L0.29289 1.63882C-0.09763 1.26392 -0.09763 0.656081 0.29289 0.281183C0.683421 -0.0937267 1.31658 -0.0937276 1.70711 0.281183L4.87793 3.32517L8.04875 0.281183C8.43928 -0.0937276 9.07244 -0.0937276 9.46297 0.281183C9.85349 0.656081 9.85349 1.26392 9.46297 1.63882L5.58504 5.36164C5.38977 5.54909 5.13385 5.64282 4.87793 5.64282Z" fill="#4D4D4D" />
    </svg>
  )

  const [isOpen, setIsOpen] = useState(false)

  const handleMenu = () => {
    setIsOpen(!isOpen)
  }

  const firstTitle = schema?.find(item => item.type === 'titulo')
  const currentPath = !!document && document?.location?.pathname?.replace('/', '')

  return (
    <div className={applyModifiers(css['container-content'], ['instmenumobile', 'instMenuMobileContainer', `${isOpen ? 'opened' : 'closed'}`, 'mobile'])}>
      <button aria-label="Expandir opções" onClick={handleMenu} className={applyModifiers(css['container-content'], ['title', 'text'])}>Navegue pelo menu<MenuIcon /></button>
      {isOpen ?
        (<div className={applyModifiers(css['list'], ['options', ''])}>
          {schema?.map((item: ItemInstMenu, index: number) => {
            const isCurrentHref = item?.href?.includes(currentPath)

            if (item.type == 'titulo') {
              return (
                <h4 key={index} title={`sessão ${item.text}`} className={applyModifiers(css['list-item'], ['option', 'title', item.text === firstTitle?.text ? 'firstTitle' : ''])} >{item.text}</h4>
              )
            }

            return <a key={index} title={`ir para ${item.text}`} href={item.href} className={applyModifiers(css['list-item'], ['option', 'link', isCurrentHref ? 'active' : 'disabled'])}>{item.text}</a>
          })}
        </div>)
        :
        null
      }
    </div>
  )
}

export default InstMenuMobile
