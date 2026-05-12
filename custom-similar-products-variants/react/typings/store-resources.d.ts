declare module 'vtex.store-resources' {
  import type { DocumentNode } from 'graphql'

  type Query = DocumentNode

  export const QueryProductRecommendations: Query
}
