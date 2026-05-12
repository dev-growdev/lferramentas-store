import React from 'react'
import { useRuntime } from 'vtex.render-runtime'
import InstMenuMobile from '../InstMenuMobile/InstMenuMobile'
import InstMenuDesktop from '../InstMenuDesktop/InstMenuDesktop'
import { UseGlobalContextInstMenu } from 'lfmaquinaseferramentas.context-global'

const InstMenu = () => {
  const context = (UseGlobalContextInstMenu())
  const schemaAppInstitutionalMenuContext = context?.items
  const { deviceInfo } = useRuntime()

  return deviceInfo.isMobile ? <InstMenuMobile schema={schemaAppInstitutionalMenuContext} /> : <InstMenuDesktop schema={schemaAppInstitutionalMenuContext} />
}

export default InstMenu
