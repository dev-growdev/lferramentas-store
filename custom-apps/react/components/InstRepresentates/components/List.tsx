import React, { useMemo, useState } from 'react'
import { applyModifiers, useCssHandles } from 'vtex.css-handles'
import { CSS_HANDLES } from '../CSS_HANDLES'
import { ListIcon } from './ListIcon'

export const List: React.FC<ListProps> = ({ items }) => {
  const [maxToShow, setMaxToShow] = useState<number>(20)
  const { handles } = useCssHandles(CSS_HANDLES)

  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.city.localeCompare(b.city))
  }, [items])

  const filteredItems = useMemo(
    () => sortedItems.filter((_, index) => index < maxToShow),
    [sortedItems, maxToShow]
  )

  return (
    <>
      <ul className={handles['inst-representantes--list']}>
        {filteredItems.map(item => {
          return (
            <li className={handles['inst-representantes--listItem']}>
              <div
                className={applyModifiers(
                  handles['inst-representantes--listItemContainer'],
                  'first'
                )}
              >
                <ListIcon />
              </div>
              <div
                className={applyModifiers(
                  handles['inst-representantes--listItemContainer'],
                  'second'
                )}
              >
                <p className={handles['inst-representantes--listItemState']}>
                  {item?.city}
                </p>
                <p className={handles['inst-representantes--listItemCity']}>
                  {item?.state}
                </p>
              </div>
              <div
                className={applyModifiers(
                  handles['inst-representantes--listItemContainer'],
                  'third'
                )}
              >
                <p className={handles['inst-representantes--listItemName']}>
                  {item?.name}
                </p>
                <p className={handles['inst-representantes--listItemAddress']}>
                  {item?.address}
                </p>
              </div>
              <div
                className={applyModifiers(
                  handles['inst-representantes--listItemContainer'],
                  'fourth'
                )}
              >
                <p className={handles['inst-representantes--listItemPhone']}>
                  {item?.phone}
                </p>
                <p className={handles['inst-representantes--listItemEmail']}>
                  {item?.email}
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
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              marginTop: '11.8px',
              padding: '0 0.3rem',
              color: '#000000',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '1rem',
            }}
          >
            Mostrando <strong>{maxToShow}</strong> de{' '}
            <strong>{items.length}</strong>
          </p>
          <button
            onClick={() => setMaxToShow(prevState => prevState + 20)}
            className={handles['inst-representantes--button']}
          >
            Ver mais representantes
          </button>
        </div>
      )}
    </>
  )
}
