export interface DataRefined {
	brand?: FieldDataRefined<string>
	category?: FieldDataRefined<string>
	product?: FieldDataRefined<string>
	sku?: FieldDataRefined<string>
	seller?: FieldDataRefined<string>
	price?: FieldDiscountDataRefined
	promotionDiscount?: FieldDataRefined<string>


	collection?: Array<FieldDataRefined<string>>
	variation?: Array<FieldDataRefined<string[]>>
	specification?: Array<FieldDataRefined<string[]>>
}

export interface BasicDataRefined {
	brand: FieldDataRefined<string>
	category: FieldDataRefined<string>
	product: FieldDataRefined<string>
	sku: FieldDataRefined<string>
	seller: FieldDataRefined<string>
}

// generic type from string | string[] with default value string

export type FieldDataRefined<T = string | string[]> = {
	value: T
	name?: string
	refGroup?: string
}

export type FieldDiscountDataRefined = {
	listPrice?: number
	sellingPrice?: number
	discountInPercentage?: number
	discountInValue?: number
}
//
// export type RefinedDataOnProductContext = {
//   brandId?: number
//   categoryId?: string
//   productId?: string
//
//   listOfCollections?: ListOfCollection[]
//   listOfVariations?: field_on_refined_data[]
//   listOfProductFields?: field_on_refined_data[]
// }
//
// // mudar
// export interface ListOfCollection {
//   id: string
//   name: string
// }
//
// export interface ListOfVariation {
//   name: string
//   values: string[]
// }
//
// export interface ListOfProductField {
//   name: string
//   values: string[]
// }
//
// export interface field_on_refined_data {
//   name: string
//   values: string[]
// }