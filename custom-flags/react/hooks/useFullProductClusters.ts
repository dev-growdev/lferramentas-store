import { useEffect, useState } from 'react'
import { ProductCluster } from '../context-global/_interfaces'

// O search-graphql (vitrines/listagens) devolve no máximo 50 coleções por produto,
// ordenadas por id. Produtos em muitas coleções perdem as mais novas (ids maiores),
// e os selos vinculados a elas não aparecem. Nesses casos buscamos a lista completa
// no catálogo, agrupando os produtos da página em poucas requisições.
const SEARCH_CLUSTERS_LIMIT = 50
const CATALOG_BATCH_SIZE = 50

type Clusters = ProductCluster[]

const cache = new Map<string, Promise<Clusters | null>>()
let queue: Array<{ productId: string; resolve: (clusters: Clusters | null) => void }> = []
let flushScheduled = false

const fetchBatch = async (batch: typeof queue) => {
  const fq = batch.map(({ productId }) => `fq=productId:${encodeURIComponent(productId)}`).join('&')

  try {
    const response = await fetch(`/api/catalog_system/pub/products/search?${fq}&_from=0&_to=${batch.length - 1}`)
    const products: Array<{ productId: string; productClusters?: Record<string, string> }> = response.ok ? await response.json() : []

    const byId = new Map(
      products.map(product => [
        String(product.productId),
        Object.entries(product.productClusters ?? {}).map(([id, name]) => ({ id, name, __typename: 'ProductClusters' }))
      ])
    )

    batch.forEach(({ productId, resolve }) => resolve(byId.get(productId) ?? null))
  } catch {
    batch.forEach(({ resolve }) => resolve(null))
  }
}

const flush = () => {
  flushScheduled = false
  const pending = queue
  queue = []

  for (let i = 0; i < pending.length; i += CATALOG_BATCH_SIZE) {
    fetchBatch(pending.slice(i, i + CATALOG_BATCH_SIZE))
  }
}

const loadClusters = (productId: string): Promise<Clusters | null> => {
  const cached = cache.get(productId)
  if (cached) return cached

  const promise = new Promise<Clusters | null>(resolve => {
    queue.push({ productId, resolve })

    if (!flushScheduled) {
      flushScheduled = true
      setTimeout(flush, 50)
    }
  }).then(clusters => {
    if (!clusters) cache.delete(productId)
    return clusters
  })

  cache.set(productId, promise)
  return promise
}

export const useFullProductClusters = (productId?: string, productClusters?: Clusters): Clusters | undefined => {
  const isTruncated = !!productId && (productClusters?.length ?? 0) >= SEARCH_CLUSTERS_LIMIT
  const [fullClusters, setFullClusters] = useState<{ productId: string; clusters: Clusters } | null>(null)

  useEffect(() => {
    if (!isTruncated || !productId) return

    let active = true

    loadClusters(productId).then(clusters => {
      if (active && clusters) setFullClusters({ productId, clusters })
    })

    return () => {
      active = false
    }
  }, [isTruncated, productId])

  if (isTruncated && fullClusters && fullClusters.productId === productId) {
    return fullClusters.clusters
  }

  return productClusters
}
