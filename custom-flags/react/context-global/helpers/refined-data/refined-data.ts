import {PPicker, PRefinedData} from './protocols'

import {DataRefined, product_context_root, T_contexts_data} from '../../_interfaces'

export class RefinedData implements PRefinedData {
	constructor(
		private readonly pickers: PPicker[],
		private readonly context: T_contexts_data
	) {
	}

	get(input: product_context_root): DataRefined {
		return this?.pickers?.reduce((acc, field) => {
			const value = field?.pick(input, this.context)

			return {
				...acc,
				[field?.attribute]: value
			}
		}, {}) as DataRefined
	}
}