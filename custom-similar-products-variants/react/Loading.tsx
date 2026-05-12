import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import Skeleton from './components/Skeleton'

const CSS_HANDLES = ['loading', 'loadingList', 'loadingItem'] as const

type Props = {
  itemsCount?: number
}

const Loading: React.FC<Props> = ({ itemsCount = 4 }) => {
  const handles = useCssHandles(CSS_HANDLES)

  const items = new Array(itemsCount).fill(0).map(() => `item`)

  return (
    <div className={handles.loading}>
      <Skeleton blockClass="title" />
      <div className={handles.loadingList}>
        {items.map((item, i) => {
          return (
            <div key={i} className={handles.loadingItem}>
              <Skeleton blockClass={`${item}-image`} />
              <Skeleton blockClass={`${item}-text`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Loading
