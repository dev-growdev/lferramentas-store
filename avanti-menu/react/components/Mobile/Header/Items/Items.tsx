import React from "react"
import { useAvantiMenuMobile } from "../../../../context/AvantiMenuContext"
import { NormalItem } from "./NormalItem"
import { LoginItem } from "./LoginItem"

export const Items = () => {
  
  const { props } = useAvantiMenuMobile()

  return (
    <>
      {props.header?.items?.map((item, index) =>
        <React.Fragment key={index}>
          {item.loginType ? <LoginItem item={item} /> : <NormalItem item={item} />}
        </React.Fragment>
      )}
    </>
  )
}
