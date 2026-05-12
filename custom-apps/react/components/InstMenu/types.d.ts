export interface GlobalSiteEditorValues {
  instMenu: [{
    schemaAppInstitutionalMenu: SchemaAppInstitutionalMenu
  }]
}

export type SchemaAppInstitutionalMenu = ItemInstMenu[]

export interface GlobalUseContextProps extends GlobalSiteEditorValues {

}

export interface ItemInstMenu {
  type: string
  __editorItemTitle: string
  text: string
  href?: string
}
