import {
	FieldDataRefined,
	FieldDiscountDataRefined,
	product_context_root,
	T_contexts_data,
	T_refined_data_keys
} from '../../../_interfaces'

export interface PPicker {
	attribute: T_refined_data_keys
	pick: (input: product_context_root, context: T_contexts_data) => FieldDataRefined[] | FieldDataRefined | FieldDiscountDataRefined | null
}