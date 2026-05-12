import {
  schema_site_editor_default_option_content,
  schema_site_editor_default_option_image,
  schema_site_editor_default_screen_config_container
} from './_schemas-site-editor-default'
import { T_schema_type_of_content, T_schema_variation } from './_schema-types'
import { DataRefined } from './_refined-data-on-product-context'
import { RemapperStylesApp } from './_remap-schema'

export type schema_remapped = {
  quadrants: schema_site_editor_remapped_root_custom_app_badge_custom | null
  refinedData: DataRefined | null
}

export interface schema_site_editor_remapped_root_custom_app_badge_custom {
  quadrantBottom?: schema_site_editor_remapped_custom_quadrant
  quadrantTopRight?: schema_site_editor_remapped_custom_quadrant
  quadrantTopLeft?: schema_site_editor_remapped_custom_quadrant

  quadrantBottomMobile?: schema_site_editor_remapped_custom_quadrant
  quadrantTopRightMobile?: schema_site_editor_remapped_custom_quadrant
  quadrantTopLeftMobile?: schema_site_editor_remapped_custom_quadrant

  quadrantHorizontal?: schema_site_editor_remapped_custom_quadrant

  quadrantHorizontalMobile?: schema_site_editor_remapped_custom_quadrant
}

export interface schema_site_editor_remapped_custom_quadrant {
  dataHTMLOnContainerFlag: any
  listOfFlags?: schema_site_editor_remapped_custom_flag[]
  priorityConfigContainer: schema_site_editor_default_screen_config_container
  name: string
  hasCollection: boolean
}

export interface schema_site_editor_remapped_custom_flag {
  currentCollection: schema_site_editor_remapped_collection_flags
  quadrantOwner: string
  priority: number
  id?: number
  HTMLAttributes?: any
  stylesApp?: RemapperStylesApp
  badgesStyles?: any
}

export interface schema_site_editor_remapped_collection_flags {
  typeContent: T_schema_type_of_content
  variant?: T_schema_variation
  styles: schema_site_editor_default_option_image | schema_site_editor_default_option_content
}
