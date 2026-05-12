import React from 'react'
import useProductMeasurementUnit from '../../hooks/useProductMeasurementUnit'

type Props = {
  measurementUnits: string[]
  type: 'show' | 'hide'
  Then?: React.FC
  Else?: React.FC
}

const ConditionaMeasurementUnit: React.FC<Props> = ({
  measurementUnits,
  type,
  Then,
  Else,
}) => {
  const currentMeasurementUnit = useProductMeasurementUnit()

  if (!currentMeasurementUnit) return null

  const hasMeasurementUnit = measurementUnits.includes(currentMeasurementUnit)

  const thenComponent = <>{Then ? <Then /> : null}</>
  const elseComponent = <>{Else ? <Else /> : null}</>

  if (type === 'show')
    return <>{hasMeasurementUnit ? thenComponent : elseComponent}</>

  if (type === 'hide')
    return <>{!hasMeasurementUnit ? thenComponent : elseComponent}</>

  return null
}

export default ConditionaMeasurementUnit
