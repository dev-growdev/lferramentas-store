import React from "react";
import { ItemInstMenu } from "../InstMenu/types"
import { cssHandles } from "./handles";
import { useCssHandles, applyModifiers } from "vtex.css-handles";

interface IProps {
  schema: ItemInstMenu[]
}

const InstMenuDesktop = ({ schema }: IProps) => {

  const { handles: css } = useCssHandles(cssHandles)
  const currentPath = !!document && document?.location?.pathname?.replace('/', '')

  return (
    <div className={applyModifiers(css['container-component'], ['instmenudesktop', 'desktop'])}>
      <div className={applyModifiers(css['list'], ['options', ''])}>
        {schema?.map((item: ItemInstMenu, index: number) => {

          const isCurrentHref = item?.href?.includes(currentPath)

          if (item.type == 'titulo') {
            return (
              <h4 key={index} title={`sessão ${item.text}`} className={applyModifiers(css['list-item'], ['option', 'title'])} >{item.text}</h4>
            )
          }

          return <a key={index} title={`ir para ${item.text}`} href={item.href} className={applyModifiers(css['list-item'], ['option', 'link', isCurrentHref ? 'active' : 'disabled'])}>{item.text}</a>
        })}
      </div>
    </div>
  )
}

export default InstMenuDesktop
