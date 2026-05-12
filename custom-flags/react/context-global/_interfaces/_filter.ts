import {schema_site_editor_default_collection_flags} from './_schemas-site-editor-default'

export type schema_site_editor_default_linkField_filtered = {
	HTMLMatch?: any
} & Omit<schema_site_editor_default_collection_flags, '_screen_config_links'>

export type schema_site_editor_default_linkField_matched = {
	HTMLMatch: Object
}