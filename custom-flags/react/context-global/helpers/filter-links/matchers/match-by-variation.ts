import {PMatch} from '../protocols'
import {
	FieldDataRefined,
	schema_site_editor_default_linkField,
	schema_site_editor_default_linkField_matched
} from '../../../_interfaces'
import {compare, GenerateHTMLKey} from '../helpers'

export class MatchByVariation implements PMatch {
	readonly attributeLinkParent = 'linksByVariation'
	readonly attributeLinkRefinedData = 'variation'

	match(productContext: Array<FieldDataRefined<string[]>>, link: schema_site_editor_default_linkField[]):
		schema_site_editor_default_linkField_matched | null {
		const listOfMatchs = link?.filter(link => {
			const matchName = productContext
				?.find(refinedData => {
					return compare(refinedData?.name) === compare(link?.name)
				})

			const matchValue = matchName?.value?.find(value => compare(value) === compare(link?.value))

			return Boolean(!!matchValue && !!matchName)
		})

		if (listOfMatchs.length === 0) return null

		const listOfMatchsRemapped = listOfMatchs?.reduce((acc, current) => {
			return {
				...acc,
				[GenerateHTMLKey(`match-by-variation-attr--name-${current?.name}--value-${current?.value}`, false)]: true,
				...(current.__editorItemTitle
					?
					{[GenerateHTMLKey(`match-by-variation-attr-site-editor--name-${current?.__editorItemTitle}`, false)]: true}
					:
					{})
			}
		}, {})

		return {
			HTMLMatch: listOfMatchsRemapped
		}
	}
}