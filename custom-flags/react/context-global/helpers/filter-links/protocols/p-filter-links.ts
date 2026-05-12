import {
	schema_site_editor_default_collection_flags,
	schema_site_editor_default_screen_config_links
} from '../../../_interfaces'

export interface PFilterLinks {
	filter: (link: schema_site_editor_default_collection_flags) => schema_site_editor_default_screen_config_links | null
}