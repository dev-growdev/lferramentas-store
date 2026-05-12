import {schema_site_editor_default_linkField_matched, T_refined_data_keys, T_resolver_links} from '../../../_interfaces'

export interface PMatch {
	attributeLinkParent: T_resolver_links
	attributeLinkRefinedData: T_refined_data_keys
	match: (input: any, link: any) => schema_site_editor_default_linkField_matched | null
}