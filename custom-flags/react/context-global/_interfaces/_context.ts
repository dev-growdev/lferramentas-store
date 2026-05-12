import { schema_site_editor_default_flags_custom } from "./_schemas-site-editor-default";
import { schema_remapped } from "./_schemas-site-editor-remapped";
import { ProductContextState } from "vtex.product-context/react/ProductTypes";

export type GlobalSiteEditorValues = {
  schemaAppFlagCustom?: schema_site_editor_default_flags_custom
}

export type GlobalUseContextProps = {
  getCollectionFlagRemapped: (refinedDataOnProductContext: Partial<ProductContextState> | undefined) => schema_remapped | null
}
