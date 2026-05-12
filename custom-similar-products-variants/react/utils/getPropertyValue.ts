import type { Product } from 'vtex.store-graphql'

type Properties = NonNullable<Product>['properties']

const getPropertyValue = (
  propertyName: string | undefined,
  properties: Properties
): string | undefined => {
  if (!propertyName) return

  if (!properties) return

  const rightProperty = properties.find((prop: any) => prop?.name === propertyName)

  if (!rightProperty) return

  const { values } = rightProperty

  if (!values) return
  if (values.length <= 0) return

  const [value] = values

  return value ?? undefined
}

export default getPropertyValue
