import { useProduct } from 'vtex.product-context'

import getSelectedItem from '../utils/getSelectedItem'

const useProductMeasurementUnit = () => {
  const ctx = useProduct()

  const item = getSelectedItem(ctx)

  const measurementUnit = item?.measurementUnit

  return measurementUnit
}

export default useProductMeasurementUnit
