import {PPicker} from '../protocols'
import {DiscountHighlight, product_context_root} from 'context-global/_interfaces/_product-context'
import {FieldDataRefined, T_refined_data_keys} from '../../../_interfaces'

export class PickPromotionDiscountField implements PPicker {
	constructor(
		readonly attribute: T_refined_data_keys
	) {
	}

	pick(input: product_context_root): FieldDataRefined[] | FieldDataRefined | null {
		const {
			Price,
			PriceWithoutDiscount,
			discountHighlights
		} = input?.product?.items?.[0]?.sellers?.[0]?.commertialOffer
		const promotionTypeDiscount = discountHighlights?.find((promo: DiscountHighlight) => promo.__typename === 'Discount')

		if (!promotionTypeDiscount || PriceWithoutDiscount === Price) {
			return null
		}

		return {
			value: promotionTypeDiscount.name
		}
	}
}