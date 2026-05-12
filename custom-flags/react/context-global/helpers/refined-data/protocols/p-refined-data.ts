import {DataRefined, product_context_root} from '../../../_interfaces'

export interface PRefinedData {
	get: (input: product_context_root) => DataRefined | null
}