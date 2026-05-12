import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useCssHandles } from 'vtex.css-handles'
import { cssHandles } from './handles/index'
import CalculatorIcon from './common/CalculatorIcon'
import { Modal } from './Modal'
import useProduct from 'vtex.product-context/useProduct'
import { Item } from 'vtex.product-context/react/ProductTypes'
interface ProductContext {
  product: any
  assemblyOption: object
  loadingItem: boolean
  selectedItem: Item | null
}

function FloorCalculator() {
  const { handles: css } = useCssHandles(cssHandles)
  const [openModal, setOpenModal] = React.useState(false)
  const [colorName] = React.useState('008345')
  const productCtx: ProductContext = useProduct()
  const [data, setData] = React.useState({
    length: '',
    width: '',
    totalWidthLength: '',
    option: {
      ten: false,
      fifteen: false,
    },
    unitMultiplier: productCtx.product.items[0].unitMultiplier,
    calcResult: 0,
  })

  useEffect(() => {
    if (!openModal) {
      setData({
        length: '',
        width: '',
        totalWidthLength: '',
        option: {
          ten: false,
          fifteen: false,
        },
        unitMultiplier: productCtx.product.items[0].unitMultiplier,
        calcResult: 0,
      })
    }
  }, [openModal])

  if (productCtx.product.items[0].measurementUnit !== 'm²') {
    return null
  }

  return (
    <>
      <div
        className={css['floorcalc-wrapper']}
        onClick={event => {
          event.preventDefault()
          event.stopPropagation()
          setOpenModal(true)
        }}
      >
        <CalculatorIcon color={colorName} />
        <button className={css['floorcalc-button-trigger']}>
          Calcule a quantidade ideal
        </button>
      </div>
      {openModal &&
        ReactDOM.createPortal(
          <Modal data={data} setData={setData} setOpenModal={setOpenModal} />,
          document.body
        )}
    </>
  )
}

export default FloorCalculator
