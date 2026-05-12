import React from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { useRenderSession } from "vtex.session-client"
import { AvantiMenuMobileContextItemProps } from "../../../../typings/types"
import { MenuArrow } from "../../Menu/MenuArrow"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { toggleClick } from "../../../Utils/toggleClick"
import { SubItems } from "../Items/SubItems"
import { FormatText } from "../../../Utils/FormatString"
import { Link } from "vtex.render-runtime"


export const LoginItem = ({ item }: AvantiMenuMobileContextItemProps) => {
  const css = useCssHandles(CSS_HANDLES)
  const { session } = useRenderSession()
  const emailSession = session?.namespaces?.authentication?.storeUserEmail?.value
  const nameLogged = session?.namespaces?.profile?.firstName?.value ?? session?.namespaces?.profile?.email?.value
  const loggedGreeting = `Olá, ${nameLogged}`
  const unloggedGreeting = <span>Bem vindo! <span className="regular-font">Entre ou cadastre-se</span></span>
  return (
    <li className={applyModifiers(css['mobile-item'], [
      FormatText(item.__editorItemTitle),
      item.items?.length ? 'hasChildren' : '',
    ])}
    >
      <Link to={(item.items?.length && item.itemsDef) && emailSession ? "/login" : "/account#"}
        onClick={(event: any) => toggleClick(event, css["mobile-item--Opened"])}
        className={applyModifiers(css["mobile-itemLink"], FormatText(item.__editorItemTitle))}
      >
        <span className={css["mobile-itemTextContent"]}>
          {(item.icon && item.iconDef) &&
            <img width={25} height={25} alt="Link Icon" src={item.icon} className={css["mobile-itemIcon"]} />
          }
          <span className={css["mobile-itemText"]}>
            {emailSession && item.myAcc ? item.myAcc : emailSession && !item.myAcc ? loggedGreeting : !emailSession && item.__editorItemTitle ? item.__editorItemTitle : unloggedGreeting}
          </span>
        </span>
        {(item.items?.length && item.itemsDef) && emailSession ? <MenuArrow /> : ""}
      </Link>
      {(item.items?.length && item.itemsDef) && emailSession ? <SubItems items={item.items} /> : ""}
    </li>
  )
}
