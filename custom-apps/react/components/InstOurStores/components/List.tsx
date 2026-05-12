import React, { useState } from 'react'
import { applyModifiers, useCssHandles } from 'vtex.css-handles'
import { CSS_HANDLES } from '../CSS_HANDLES'
import { ListIconActive } from './ListIconActive'
import { ListIconInactive } from './ListIconInactive'

export const List: React.FC<ListStoreProps> = ({ items, quantityOfItems }) => {
  const [maxToShow, setMaxToShow] = useState<number>(6)
  const { handles } = useCssHandles(CSS_HANDLES)

  const sortedItems = items.sort((a, b) => {
    if (a.storeActive === b.storeActive) return 0

    return a.storeActive ? 1 : -1
  })

  const filteredItems = sortedItems.filter((_, index) => index < maxToShow)

  return (
    <>
      <ul className={handles['inst-stores--list']}>
        {filteredItems.map(item => {
          return (
            <li key={item?.nome} className={handles['inst-stores--listItem']}>
              {!item?.storeImage && (
                <div
                  className={applyModifiers(
                    handles['inst-stores--listItemContainer'],
                    'first'
                  )}
                >
                  {item.storeActive ? <ListIconActive /> : <ListIconInactive />}
                </div>
              )}
              {item?.storeImage && (
                <div
                  className={applyModifiers(
                    handles['inst-stores--listItemContainer'],
                    'first'
                  )}
                >
                  <img
                    className={handles['inst-stores--listItemImage']}
                    src={item.storeImage}
                    alt={item.nome}
                    width={133}
                    height={93}
                  />
                </div>
              )}
              <div
                className={applyModifiers(
                  handles['inst-stores--listItemContainer'],
                  'second'
                )}
              >
                <p className={handles['inst-stores--listItemState']}>
                  {item?.nome}
                </p>
                <p className={handles['inst-stores--listItemCity']}>
                  {item?.cidade}
                </p>
                <p className={handles['inst-stores--listItemCity']}>
                  {item?.estado}
                </p>
              </div>
              <div
                className={applyModifiers(
                  handles['inst-stores--listItemContainer'],
                  'third'
                )}
              >
                {item.storeActive ? (
                  <>
                    <p className={handles['inst-stores--listItemAddress']}>
                      {item?.endereco}
                    </p>
                    <p className={handles['inst-stores--listItemAddress']}>
                      {item?.bairro}
                    </p>
                  </>
                ) : null}
              </div>
              <div
                className={applyModifiers(
                  handles['inst-stores--listItemContainer'],
                  'fourth'
                )}
              >
                <p className={handles['inst-stores--listItemPhone']}>
                  {item?.telefone}
                </p>
                <p className={handles['inst-stores--listItemEmail']}>
                  {item?.horario}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
      {items.length > filteredItems.length && (
        <div
          style={{
            display: 'flex',
          }}
        >
          <button
            onClick={() => setMaxToShow(quantityOfItems)}
            className={handles['inst-stores--button']}
          >
            Ver mais representantes
          </button>
        </div>
      )}
    </>
  )
}
