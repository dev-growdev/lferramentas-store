import {
  schema_site_editor_default_option_content,
  schema_site_editor_default_option_image,
  schema_site_editor_default_root_app_badge_custom,
  schema_site_editor_default_screen_config_position,
  schema_site_editor_remapped_custom_flag,
  schema_site_editor_remapped_custom_quadrant,
  schema_site_editor_remapped_root_custom_app_badge_custom
} from '../../_interfaces'
import {
  RemapperContentContent,
  RemapperContentImage,
  RemapperQuadrantBottom,
  RemapperQuadrantTopLeft,
  RemapperStylesApp,
  RemapperQuadrantTopRight,
  RemappperQuadrantHorizontal
} from '../../_interfaces'
import { SortMatchs } from '../sort-matchs/sort-matchs'
import { FilterLinks } from '../filter-links'
import { DEV_VAR_MAX_ITEMS_ON_QUADRANTS } from '../../dev-vars'

export class RemapSchema {
  constructor(
    private readonly schema: schema_site_editor_default_root_app_badge_custom,
    private readonly Filter: FilterLinks,
    private readonly SortMatchs: SortMatchs
  ) {
  }

  public remapQuadrantHorizontal(): RemappperQuadrantHorizontal {
    return {
      position: 'static',
      display: 'flex',
      alignItems: 'center',
      columnGap: '5px',
      rowGap: '5px',
      flexWrap: 'wrap'
    }
  }

  public remapQuadrantTopLeft(attribute: schema_site_editor_default_screen_config_position): RemapperQuadrantTopLeft {
    return {
      left: attribute?.horizontalDistance ?? '0px',
      top: attribute?.verticalDistance ?? '0px',
      maxWidth: '50%',
      display: 'flex',
      flexDirection: 'column',
      rowGap: '5px'
    }
  }

  public remapQuadrantTopRight(attribute: schema_site_editor_default_screen_config_position): RemapperQuadrantTopRight {
    return {
      right: attribute?.horizontalDistance ?? '0px',
      top: attribute?.verticalDistance ?? '0px',
      maxWidth: '50%',
      display: 'flex',
      flexDirection: 'column',
      rowGap: '5px'
    }
  }

  public remapQuadrantBottom(attribute: schema_site_editor_default_screen_config_position): RemapperQuadrantBottom {
    let attributeVariation = null

    if (attribute?.positionFlow === 'leftToRight') {
      attributeVariation = {
        left: attribute?.horizontalDistance,
        flexDirection: 'row'
      }
    }

    if (attribute?.positionFlow === 'rightToLeft') {
      attributeVariation = {
        right: attribute?.horizontalDistance,
        flexDirection: 'row-reverse'
      }
    }

    if (attribute?.positionFlow === 'center') {
      attributeVariation = {
        left: '50%',
        transform: 'translateX(-50%)',
        flexDirection: 'row',
        justifyContent: 'center'
      }
    }

    return {
      bottom: attribute?.verticalDistance,
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      rowGap: '5px',
      width: '100%',
      justifyContent: 'space-between',
      columnGap: '5px',
      flexWrap: 'wrap',
      ...attributeVariation
    }
  }

  public remapQuadrantHorizontalMobile(): RemappperQuadrantHorizontal {
    return {
      position: 'static',
      display: 'flex',
      alignItems: 'center',
      columnGap: '5px',
      rowGap: '5px',
      flexWrap: 'wrap'
    }
  }

  public remapQuadrantTopLeftMobile(attribute: schema_site_editor_default_screen_config_position): RemapperQuadrantTopLeft {
    return {
      left: attribute?.horizontalDistance ?? '0px',
      top: attribute?.verticalDistance ?? '0px',
      maxWidth: '50%',
      display: 'flex',
      flexDirection: 'column',
      rowGap: '5px'
    }
  }

  public remapQuadrantTopRightMobile(attribute: schema_site_editor_default_screen_config_position): RemapperQuadrantTopRight {
    return {
      right: attribute?.horizontalDistance ?? '0px',
      top: attribute?.verticalDistance ?? '0px',
      maxWidth: '50%',
      display: 'flex',
      flexDirection: 'column',
      rowGap: '5px'
    }
  }

  public remapQuadrantBottomMobile(attribute: schema_site_editor_default_screen_config_position): RemapperQuadrantBottom {
    let attributeVariation = null

    if (attribute?.positionFlow === 'leftToRight') {
      attributeVariation = {
        left: attribute?.horizontalDistance,
        flexDirection: 'row'
      }
    }

    if (attribute?.positionFlow === 'rightToLeft') {
      attributeVariation = {
        right: attribute?.horizontalDistance,
        flexDirection: 'row-reverse'
      }
    }
    if (attribute?.positionFlow === 'center') {
      attributeVariation = {
        left: '50%',
        transform: 'translateX(-50%)',
        flexDirection: 'row',
        justifyContent: 'center'

      }
    }

    return {
      bottom: attribute?.verticalDistance,
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      rowGap: '5px',
      width: '100%',
      justifyContent: 'space-between',
      columnGap: '5px',
      flexWrap: 'wrap',
      ...attributeVariation
    }
  }

  public remapContentImage(attribute: schema_site_editor_default_option_image): RemapperContentImage {
    return {
      src: attribute?.src,
      alt: attribute?.alt,
      width: attribute?.commonPropsBetweenContentAndImage?.width ?? 'auto',
      height: attribute?.commonPropsBetweenContentAndImage?.height ?? 'auto'
    }
  }

  public remapContentContent(attribute: schema_site_editor_default_option_content): RemapperContentContent {
    let widthPropertie: any = null

    const attributeWidth = attribute?.commonPropsBetweenContentAndImage?.width

    const containFlexSpaceOnAttribute = attributeWidth?.includes('width', 0)
    const sanitizeWidth = attributeWidth || 'auto'

    if (!containFlexSpaceOnAttribute) {
      widthPropertie = { width: sanitizeWidth }
    }

    return {
      text: attribute?.text,
      color: attribute?.color || '#000',
      fontSize: attribute?.fontSize || '14px',
      lineHeight: attribute?.fontSize || '14px',
      fontWeight: attribute?.fontWeight || '400',
      borderRadius: attribute?.borderRadius || '0px',
      backgroundColor: attribute?.backgroundColor || '#fff',
      ...widthPropertie,
      height: attribute?.commonPropsBetweenContentAndImage?.height || 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      zIndex: 10
    }
  }

  public remapStylesApp(attribute: schema_site_editor_default_option_content, quadrant: keyof schema_site_editor_default_root_app_badge_custom): RemapperStylesApp {
    let widthPropertie: any = null
    const attributeWidth = attribute?.commonPropsBetweenContentAndImage?.width

    const containFlexSpaceOnAttribute = attributeWidth?.includes('width', 0)

    if (containFlexSpaceOnAttribute && (quadrant === 'quadrantBottom' || quadrant === 'quadrantBottomMobile')) {
      if (attributeWidth === 'widthRestOfLine') {
        widthPropertie = { flexGrow: '1' }
      }

      if (attributeWidth === 'widthAllLine') {
        widthPropertie = { flexBasis: 'calc(100%)' }
      }

      if (attributeWidth === 'widthHalfLine') {
        widthPropertie = { flexBasis: 'calc(50% - 5px)' }
      }

      if (attributeWidth === 'widthOneThird') {
        widthPropertie = { flexBasis: 'calc(33% - 5px)' }
      }

      return {
        containerBadge: {
          ...widthPropertie
        }
      }
    } else {
      return {
        containerBadge: {}
      }
    }
  }

  public remap(): schema_site_editor_remapped_root_custom_app_badge_custom | null {
    if (!this?.schema) {
      return {
        quadrantBottom: null,
        quadrantTopLeft: null,
        quadrantTopRight: null,
        quadrantHorizontal: null,
        quadrantBottomMobile: null,
        quadrantTopLeftMobile: null,
        quadrantTopRightMobile: null,
        quadrantHorizontalMobile: null
      } as any
    }

    return {
      // @ts-ignore
      ...Object?.keys(this?.schema)?.reduce((acc: schema_site_editor_remapped_root_custom_app_badge_custom, key: keyof schema_site_editor_default_root_app_badge_custom) => {
        const currentQuadrantContainer = this?.schema?.[key]?.[0]

        if (key === '__editorItemTitle' as any) {
          return null
        }

        if (!currentQuadrantContainer) {
          return {
            ...acc,
            [key]: null
          }
        }

        const attributeContainerFlag = currentQuadrantContainer?._screen_config_position

        return {
          ...acc,
          [key]: {
            name: key,
            dataHTMLOnContainerFlag: {
              style: {
                position: 'absolute',
                ...(key === 'quadrantHorizontal' && this?.remapQuadrantHorizontal()),
                ...(key === 'quadrantTopLeft' && this?.remapQuadrantTopLeft(attributeContainerFlag)),
                ...(key === 'quadrantTopRight' && this?.remapQuadrantTopRight(attributeContainerFlag)),
                ...(key === 'quadrantBottom' && this?.remapQuadrantBottom(attributeContainerFlag)),
                ...(key === 'quadrantHorizontalMobile' && this?.remapQuadrantHorizontalMobile()),
                ...(key === 'quadrantTopLeftMobile' && this?.remapQuadrantTopLeftMobile(attributeContainerFlag)),
                ...(key === 'quadrantTopRightMobile' && this?.remapQuadrantTopRightMobile(attributeContainerFlag)),
                ...(key === 'quadrantBottomMobile' && this?.remapQuadrantBottomMobile(attributeContainerFlag))
              }
            },

            listOfFlags: currentQuadrantContainer?.collection
              ?.map(collection => this?.Filter?.filter(collection))
              ?.filter(Boolean)
              ?.map((collection) => ({
                priority: Number(collection?.priority),
                quadrantOwner: key,
                currentCollection: {
                  typeContent: collection?.typeContent,

                  styles: {
                    ...collection?.items?.[0]
                  }
                },
                HTMLAttributes: collection?.HTMLMatch,
                stylesApp: this.remapStylesApp((collection?.items as schema_site_editor_default_option_content[])?.[0], key),
                badgesStyles: {
                  ...collection?.typeContent === 'image' && this?.remapContentImage((collection?.items as schema_site_editor_default_option_image[])?.[0]),

                  ...collection?.typeContent === 'createContent' && this?.remapContentContent((collection?.items as schema_site_editor_default_option_content[])?.[0])
                }
              } as schema_site_editor_remapped_custom_flag))
              // @ts-ignore
              ?.sort((a, b) => this?.SortMatchs
                .sort(Number(a?.priority), Number(b?.priority),
                  currentQuadrantContainer?._screen_config_priority?.[0]?.isInverted,
                  currentQuadrantContainer?._screen_config_priority?.[0]?.prioritySystemOnQuadrant))
              ?.slice(0, DEV_VAR_MAX_ITEMS_ON_QUADRANTS?.[key] ?? 10)
          } as schema_site_editor_remapped_custom_quadrant
        } as schema_site_editor_remapped_root_custom_app_badge_custom
      }, {
        quadrantBottom: null,
        quadrantTopLeft: null,
        quadrantTopRight: null,
        quadrantHorizontal: null,
        quadrantBottomMobile: null,
        quadrantTopLeftMobile: null,
        quadrantTopRightMobile: null,
        quadrantHorizontalMobile: null,
      })

    }
  }
}
