export interface SearchQueryResponse {
  documents: Document[]
}
export interface Document {
  id: string
  cacheId: string
  fields: Field[]
}
export interface Field {
  key: string
  value: string
}
