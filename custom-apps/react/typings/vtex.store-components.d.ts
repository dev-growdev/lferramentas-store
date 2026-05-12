import React from 'react'

export {}

type GradientCollapseProps = {
  collapseHeight: number
  onCollapsedChange: (evt: React.MouseEvent<HTMLElement>, boolean) => void
  collapsedProp: boolean
}

declare module 'vtex.store-components' {
  export const SKUSelector
  export const DiscountBadge
  export const ProductPrice
  export const BuyButton
  export const GradientCollapse: React.FC<GradientCollapseProps>
}
