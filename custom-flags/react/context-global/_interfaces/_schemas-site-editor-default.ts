//
// ** Valores que estão chegando do site editor **
//
import { T_schema_position_flow, T_schema_priority, T_schema_type_of_content, T_schema_variation } from './_schema-types'

export type schema_site_editor_default_screen_config_links = {
  __editorItemTitle?: string
  linksByMock?: any
  linksByProduct?: schema_site_editor_default_linkField[]
  linksByCollection?: schema_site_editor_default_linkField[]
  linksBySpecification?: schema_site_editor_default_linkField[]
  linksBySKU?: schema_site_editor_default_linkField[]
  linksByVariation?: schema_site_editor_default_linkField[]
  linksByCategory?: schema_site_editor_default_linkField[]
  linksByBrand?: schema_site_editor_default_linkField[]
  linksByPromotionDiscount?: schema_site_editor_default_linkField[]
}

export type schema_site_editor_default_linkField = {
  '_'?: string
  __editorItemTitle?: string
  name?: string
  value: string | number
}

export interface schema_site_editor_default_root_app_badge_custom {
  quadrantBottom?: schema_site_editor_default_container_generic_quadrant[]
  quadrantTopRight?: schema_site_editor_default_container_generic_quadrant[]
  quadrantTopLeft?: schema_site_editor_default_container_generic_quadrant[]
  quadrantHorizontal?: schema_site_editor_default_container_generic_quadrant[]

  quadrantBottomMobile?: schema_site_editor_default_container_generic_quadrant[]
  quadrantTopRightMobile?: schema_site_editor_default_container_generic_quadrant[]
  quadrantTopLeftMobile?: schema_site_editor_default_container_generic_quadrant[]
  quadrantHorizontalMobile?: schema_site_editor_default_container_generic_quadrant[]
}

export type schema_site_editor_default_screen_config_container = {
  '_'?: string
  '_2'?: string
  __editorItemTitle?: string
  prioritySystemOnQuadrant: T_schema_priority
  isInverted: boolean
}

export interface schema_site_editor_default_container_generic_quadrant {
  __editorItemTitle?: string
  _screen_config_position: schema_site_editor_default_screen_config_position
  _screen_config_priority: [schema_site_editor_default_screen_config_container]
  collection?: schema_site_editor_default_collection_flags[]
}

export interface schema_site_editor_default_screen_config_position {
  __editorItemTitle: string
  horizontalDistance: string
  verticalDistance: string
  positionFlow?: T_schema_position_flow
}

export interface schema_site_editor_default_flags_custom {
  __editorItemTitle?: string
  quadrantBottom?: schema_site_editor_default_container_generic_quadrant[]
  quadrantTopRight?: schema_site_editor_default_container_generic_quadrant[]
  quadrantTopLeft?: schema_site_editor_default_container_generic_quadrant[]
  quadrantHorizontal?: schema_site_editor_default_container_generic_quadrant[]
}

export interface schema_site_editor_default_collection_flags {
  __editorItemTitle?: string
  typeContent: T_schema_type_of_content
  variant?: T_schema_variation
  isActive: boolean
  withoutLink?: boolean
  priority: string
  _screen_config_links: schema_site_editor_default_screen_config_links[]
  items: schema_site_editor_default_option_image[] | schema_site_editor_default_option_content[]
}

// se opção selecionada:imagem
export interface schema_site_editor_default_option_image {
  src: string
  alt: string
  commonPropsBetweenContentAndImage: schema_site_editor_default_common_image_content
}

// se opção selecionada:criar conteúdo
export interface schema_site_editor_default_option_content {
  '__editorItemTitle'?: string
  text?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  backgroundColor?: string
  borderRadius?: string
  commonPropsBetweenContentAndImage?: schema_site_editor_default_common_image_content
}

// propriedades comuns para imagem e conteúdo customizados
export interface schema_site_editor_default_common_image_content {
  width: string
  height: string
}
