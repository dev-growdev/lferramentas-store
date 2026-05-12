
export interface propsCommertialOffer {
  filter: any,
  AvailableQuantity: number,
  CacheVersionUsedToCallCheckout: string,
  Installments: propsIntallments[],
  ListPrice: number,
  Price: number,
  PriceValidUntil: string,
  PriceWithoutDiscount: number,
  RewardValue: number,
  Tax: number,
  discountHighlights: [],
  spotPrice: number,
  taxPercentage: number,
  teasers: [],
  __typename: string
}

export interface propsIntallments {
  InterestRate: number,
  Name: string,
  NumberOfInstallments: number,
  PaymentSystemName: string,
  TotalValuePlusInterestRate: number,
  Value: number
}

export interface propsTeasers {
  conditions: []
  effects: parametersEffects[],
  name: string
}

export interface parametersEffects {
  parameters: parametersEffectsContent[],
  __typename: string
}
export interface parametersEffectsContent {
  name: string,
  value: string
}
