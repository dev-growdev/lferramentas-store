import React from "react"
import { useCssHandles } from "vtex.css-handles"
import { useRenderSession } from 'vtex.session-client'
import { useAvantiMenuMobile } from "../../../../context/AvantiMenuContext"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { Link } from "vtex.render-runtime"

export const Items = () => {

  const { props, setOpen } = useAvantiMenuMobile()
  const { session } = useRenderSession()
  const css = useCssHandles(CSS_HANDLES)
  const emailSession = session?.namespaces?.authentication?.storeUserEmail?.value
  const userName = session?.namespaces?.profile?.firstName?.value

  return (
    <>
      {props.footer?.items?.map(({ __editorItemTitle, url, icon, iconDef, loginType }) => (
        <Link to={loginType ? '/account#' : url} onClick={() => setOpen(false)} key={__editorItemTitle} className={css['mobile-itemLink']}>
          {icon && iconDef && <img width={25} height={25} alt="Link Icon" src={icon} className={css['mobile-itemIcon']} />}
          {emailSession && loginType ?
            <span className={css['mobile-itemText']}>
              Bem-vindo{userName && ` ${userName}`}, <span className={css['mobile-itemTextMyAcc']}>minha conta</span>
            </span> :
            <span className={css['mobile-itemText']}>
              {__editorItemTitle}
            </span>
          }
        </Link>
      ))}
    </>
  )
}
