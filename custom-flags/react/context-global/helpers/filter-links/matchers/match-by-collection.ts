import {PMatch} from '../protocols'
import {
	FieldDataRefined,
	schema_site_editor_default_linkField,
	schema_site_editor_default_linkField_matched
} from '../../../_interfaces'
import {compare, GenerateHTMLKey} from '../helpers'

export class MatchByCollection implements PMatch {
	readonly attributeLinkParent = 'linksByCollection'
	readonly attributeLinkRefinedData = 'collection'

	match(productContext: Array<FieldDataRefined<string>>, link: schema_site_editor_default_linkField[]):
		schema_site_editor_default_linkField_matched | null {
		const listOfMatchs = link.filter(link => {
			const match = productContext
				?.find(refinedData => {
					return compare(refinedData?.value) === compare(link?.value)
				})

			return match
		})

		if (listOfMatchs.length === 0) return null

		const listOfMatchsRemapped = listOfMatchs?.reduce((acc, current) => {
			return {
				...acc,
				[GenerateHTMLKey(`match-by-collection-attr--value-${current?.value}`, false)]: true,
				...(current.__editorItemTitle
					?
					{[GenerateHTMLKey(`match-by-collection-attr-site-editor--name-${current?.__editorItemTitle}`, false)]: true}
					:
					{})
			}
		}, {})

		return {
			HTMLMatch: listOfMatchsRemapped
		}
	}
}