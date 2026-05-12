import React from 'react'
import { RenderFlagProductSummary } from './components/render-flag-product-summary'

const RenderMobileFlagProductSummary = () => {
  return <RenderFlagProductSummary variation="Mobile" keysToMatch={['quadrantBottomMobile', 'quadrantTopLeftMobile', 'quadrantTopRightMobile']}/>
}

export default RenderMobileFlagProductSummary