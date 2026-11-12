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

    // Une as duas listas: productClusters pode vir truncado na listagem,
    // e clusterHighlights pode conter coleções que ficaram de fora dele.
    const allCollections = [
      ...(input?.product?.productClusters ?? []),
      ...(input?.product?.clusterHighlights ?? [])
    ]

    const uniqueCollections = allCollections.filter(
      (collection, index) => allCollections.findIndex(item => String(item?.id) === String(collection?.id)) === index
    )

    const data = uniqueCollections.map((collection) => ({
      name: collection?.name,
      value: collection?.id
    }))


    if (!data || data.length === 0) {
      return null
    }

    return data
  }
}
