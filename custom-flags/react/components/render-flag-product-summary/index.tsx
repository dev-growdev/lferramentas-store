import React, { useContext } from 'react'
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'

import styles from './styles.css'
import { GlobalContext } from '../../context-global'
import { schema_site_editor_remapped_root_custom_app_badge_custom } from '../../context-global/_interfaces'
import { useFullProductClusters } from '../../hooks/useFullProductClusters'
interface IProps {
  variation: string;
  keysToMatch: Array<keyof schema_site_editor_remapped_root_custom_app_badge_custom>;
}

const CSS_HANDLES = ["containerQuadrantFlagsAvanti"]

export const RenderFlagProductSummary = ({ variation, keysToMatch }: IProps) => {
  const { getCollectionFlagRemapped } = useContext(GlobalContext)
  const handles = useCssHandles(CSS_HANDLES)

  const productContext = useProduct()
  const product = productContext?.product as any
  const productClusters = useFullProductClusters(product?.productId, product?.productClusters)

  const collectionsRemapped = getCollectionFlagRemapped(
    product && productClusters !== product.productClusters
      ? { ...productContext, product: { ...product, productClusters } }
      : productContext
  )

  if (!collectionsRemapped) {
    return null
  }

  const { quadrants, refinedData } = collectionsRemapped

  if (!quadrants || !refinedData) {
    return null
  }

  return (
    <div className={handles.containerQuadrantFlagsAvanti}>
      {Object.keys(quadrants)?.map((key: string) => {
        const currentQuadrant = quadrants?.[key as keyof typeof quadrants]

        if (!currentQuadrant || !keysToMatch.includes(key as keyof typeof quadrants)) {
          return null
        }

        return (
          <div key={currentQuadrant?.name} className={`${styles[`container${currentQuadrant?.name}`]} ${styles[`container${variation}`]}`} {...currentQuadrant?.dataHTMLOnContainerFlag} style={{ ...currentQuadrant?.dataHTMLOnContainerFlag?.style }}>
            {currentQuadrant?.listOfFlags?.map((content, index) => {
              const {
                currentCollection: { typeContent },
                HTMLAttributes,
                stylesApp,
                badgesStyles: {
                  text = '',
                  ...restBadges
                }
              } = content

              // Filter to not allow passing invalid names
              const filteredHTMLAttributes = Object.keys(HTMLAttributes).reduce((acc: Record<string, any>, key) => {
                const newKey = key?.replace(/[\|%$]/gi, '')
                acc[newKey] = HTMLAttributes[key]
                
                return acc
              }, {} as Record<string, any>)

              return (
                <div key={index} {...filteredHTMLAttributes} style={{ ...stylesApp?.containerBadge }}
                  className={`${styles.containerContentRender}`}>
                  {typeContent === 'image'
                    ?
                    (<img {...restBadges} style={{ display: 'flex', ...((restBadges?.width as string).includes('px') ? { width: restBadges?.width } : { width: '100%' }) }} onError={(e) => { e.currentTarget.style.display = 'none' }} />)
                    :
                    (
                      <span style={(restBadges as unknown) as React.CSSProperties} className={`${styles.flag}`}>
                        {text}
                      </span>
                    )
                  }
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
