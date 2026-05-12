import React from 'react'
import { RenderFlagProductSummary } from './components/render-flag-product-summary'

const RenderDesktopFlagProductSummary = () => {
  return <RenderFlagProductSummary variation="Desktop" keysToMatch={['quadrantBottom', 'quadrantTopLeft', 'quadrantTopRight']} />
}
export default RenderDesktopFlagProductSummary
