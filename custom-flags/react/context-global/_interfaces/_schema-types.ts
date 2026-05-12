import { schema_site_editor_default_screen_config_links } from './_schemas-site-editor-default'
import { DataRefined, BasicDataRefined } from './_refined-data-on-product-context'

export type T_schema_priority = 'priorityByList' | 'priorityByField'
export type T_schema_position_flow = 'leftToRight' | 'rightToLeft' | 'center'
export type T_schema_type_of_content = 'image' | 'createContent'
export type T_schema_variation = 'variant-default' | 'variant-1' | 'variant-2' | 'variant-3'
export type T_refined_data_keys = keyof DataRefined
export type T_refined_basic_data_keys = keyof BasicDataRefined
export type T_resolver_links = keyof Omit<schema_site_editor_default_screen_config_links, '__editorItemTitle'>
export type T_contexts_data = 'summary' | 'pdp'
export type T_styles = {} & React.CSSProperties
