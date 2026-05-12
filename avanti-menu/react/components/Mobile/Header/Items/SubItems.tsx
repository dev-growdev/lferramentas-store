import React from "react"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { useRenderSession } from "vtex.session-client"
import { useAvantiMenuMobile } from "../../../../context/AvantiMenuContext"
import { AvantiMenuMobileContextItemsProps } from "../../../../typings/types"
import { FormatText } from "../../../Utils/FormatString"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { Link } from "vtex.render-runtime"

export const SubItems = ({ items }: AvantiMenuMobileContextItemsProps) => {

  const { setOpen } = useAvantiMenuMobile()
  const { session } = useRenderSession()
  const css = useCssHandles(CSS_HANDLES)
  const emailSession = session?.namespaces?.authentication?.storeUserEmail?.value
  const userName = session?.namespaces?.profile?.firstName?.value

  console.log("SubItems", items, session)

  return (
    <div className={css["mobile-subItems"]}>
      <ul className={css["mobile-subItemsContent"]}>
        {items?.map(({ __editorItemTitle, url, icon, iconDef, loginType }, index) =>
          <li className={applyModifiers(
            css["mobile-subItem"],
            FormatText(__editorItemTitle)
          )}
            key={index}
          >
            <Link to={loginType ? "/account#" : url}
              onClick={() => setOpen(false)}
              className={css["mobile-subItemLink"]}
            >
              {(icon && iconDef) &&
                <img width={25} height={25} alt={__editorItemTitle} src={icon} className={css["mobile-itemIcon"]} />
              }
              {emailSession && loginType ?
                <span className={css["mobile-subItemText"]}>
                  Bem-vindo{userName && ` ${userName}`},{" "}
                  <span className={css["mobile-itemsTextMyAcc"]}>
                    minha conta
                  </span>
                </span>
                :
                <span className={css["mobile-subItemText"]}>
                  {__editorItemTitle}
                </span>
              }
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}
