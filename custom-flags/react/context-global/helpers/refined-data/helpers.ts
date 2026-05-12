import {T_refined_basic_data_keys, product_context_root} from '../../_interfaces'

export const basicFieldPaths = (attribute: T_refined_basic_data_keys, input: product_context_root) => {
	return {
		brand: {
			name: input?.product?.brand,
			value: input?.product?.brandId?.toString()
		},
		category: {
			name: null,
			value: input?.product?.categoryId
		},
		product: {
			name: input?.product?.productName,
			value: input?.product?.productId
		},
		seller: {
			name: input?.product?.sku?.seller?.sellerName,
			value: input?.product?.sku?.seller?.sellerId
		},
		sku: {
      name: input?.selectedItem?.name,
      value: input?.selectedItem?.itemId
    }
	}[attribute]
}