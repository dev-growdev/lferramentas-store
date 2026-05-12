export class CMSHelper {

  public static thisPageIsSiteEditor(): boolean {
    return window?.location?.href?.includes('siteEditor')
  }

  public static thisIsDevWorkspace(): boolean {
    const url = window?.location?.href;

    const regex = /^https?:\/\/([a-z0-9]+)--([a-z0-9]+)\.myvtex\.com\/.*__siteEditor/;

    return regex.test(url);
  }

  public static generateImagePage(title: string = 'Configurar imagem'): SchemaArraySiteEditor {
    return {
      type: "array",
      title,
      maxItems: 1,
      items: {
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Título',
            type: 'string',
            description: 'Título que sera exibido ao passar o mouse sobre a imagem.'
          },

          srcDesktop: {
            title: "Imagem desktop",
            description: 'Imagem exibida em dispositivos desktop',
            type: "string",
            widget: {
              "ui:widget": "image-uploader"
            }
          },

          srcMobile: {
            title: "Imagem mobile",
            description: 'Imagem exibida em dispositivos mobile',
            type: "string",
            widget: {
              "ui:widget": "image-uploader"
            }
          },

          alt: {
            title: "Texto Alternativo",
            type: "string",
            description: 'Texto que descreve o conteúdo da imagem para acessibilidade e SEO.'
          }
        }
      }

    }
  }

  public static generateResponsiveOption(): SchemaObjectProperty {
    return {
      responsive_option_desktop: {
        type: 'boolean',

        title: 'visivel em dispositivos Desktop',
        default: true
      },

      responsive_option_tablet: {
        type: 'boolean',
        title: 'visivel em dispositivos Tablet',
        default: true
      },

      responsive_option_mobile: {
        type: 'boolean',

        title: 'visivel em dispositivos Mobile',
        default: true
      }
    }
  }
}

export type UiWidget = 'image-uploader' | 'textarea' | 'datetime' | 'select' | 'color';



type StringType = {
  type: 'string'
  title: string
  description?: string
  default?: string
  enum?: string[],
  disabled?: boolean,
  enumNames?: string[],
  widget?: {
    "ui:widget": UiWidget
  }
}

type NumberType = {
  type: 'number',
  title: string,
  description?: string
  default?: number
}

type BooleanType = {
  type: 'boolean',
  title: string,
  description?: string
  default?: boolean
}

export type SchemaObjectProperty = Record<string, SchemaSiteEditor>


export type SchemaObjectSiteEditor = {
  type: 'object';
  dependencies?: {
    contentType: {
      oneOf: Array<{ properties: Record<string, Partial<SchemaSiteEditor>> }>
    }
  }
  properties?: SchemaObjectProperty;
}

export type SchemaArraySiteEditor = {
  type: 'array'
  title: string;
  minItems?: number;
  maxItems?: number;
  items: SchemaObjectSiteEditor;
}

export type SchemaRef = {
  $ref: string
}

export type SchemaSiteEditor = SchemaObjectSiteEditor | SchemaArraySiteEditor | BooleanType | NumberType | StringType | SchemaRef


