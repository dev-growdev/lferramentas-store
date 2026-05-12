import {PPicker} from '../protocols'
import {FieldDataRefined, T_refined_data_keys} from '../../../_interfaces'
import {product_context_root} from '../../../_interfaces/_product-context'
import {basicFieldPaths} from '../helpers'

export class PickBasicField implements PPicker {
	constructor(
		readonly attribute: T_refined_data_keys
	) {
	}

	pick(input: product_context_root): FieldDataRefined[] | FieldDataRefined | null {
		if (!input) {
			return null
		}

		// @ts-ignore
		const data = basicFieldPaths(this.attribute, input)

		if (!data || Boolean(!data?.value)) {
			return null
		}

		return data as FieldDataRefined | FieldDataRefined[] | null
	}
}