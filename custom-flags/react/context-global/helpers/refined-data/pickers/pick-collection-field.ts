import { PPicker } from '../protocols'
import { FieldDataRefined, product_context_root, T_refined_data_keys } from '../../../_interfaces'

export class PickCollectionField implements PPicker {
  constructor(
    readonly attribute: T_refined_data_keys
  ) {
  }

  pick(input: product_context_root): FieldDataRefined[] | FieldDataRefined | null {
    if (!input) {
      return null
    }

    const pickValidArray = input?.product?.clusterHighlights?.length > input?.product?.productClusters?.length
      ?
      input?.product?.clusterHighlights
      :
      input?.product?.productClusters

    const data = pickValidArray?.map((collection) => ({
      name: collection?.name,
      value: collection?.id
    }))


    if (!data || data.length === 0) {
      return null
    }

    return data
  }
}
