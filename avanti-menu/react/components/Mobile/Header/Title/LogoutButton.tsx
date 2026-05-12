import React from "react"
import { useCssHandles } from "vtex.css-handles"
import { useRenderSession } from "vtex.session-client"
import { useAvantiMenuMobile } from "../../../../context/AvantiMenuContext"
import { CSS_HANDLES } from "../../CSS_HANDLES"
import { Link } from "vtex.render-runtime"

export const LogoutButton = () => {

  const css = useCssHandles(CSS_HANDLES)
  const { props, setOpen } = useAvantiMenuMobile()
  const { session } = useRenderSession()
  const emailSession = session?.namespaces?.authentication?.storeUserEmail?.value

  return (
    <>
      {emailSession && props.header?.logoutDef &&
        <Link onClick={() => setOpen(false)} to="/logout" title="Logout" className={css['mobile-logoutButton']}>
          {props.header.logoutLabel}
        </Link>
      }
    </>
  )
}
