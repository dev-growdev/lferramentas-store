import React, { useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { CSS_HANDLES } from '../CSS_HANDLES'

export const Filters: React.FC<FilterStoreProps> = ({
  title,
  setAvailableStates,
  setAvailableCities,
  setSelectedState,
  setSelectedCity,
  selectedState,
  availableStates,
  availableCities,
  stores,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    const states = stores
      .map(item => item.estado)
      .filter((item, index, self) => self.indexOf(item) === index)

    setAvailableStates(states)
  }, [stores])

  useEffect(() => {
    if (!selectedState) {
      setAvailableCities([])
      return
    }

    if (selectedState) {
      const cities = stores
        .filter(item => item.estado === selectedState)
        .map(item => item.cidade)
        .filter((item, index, self) => self.indexOf(item) === index)

      setAvailableCities(cities)
    }
  }, [selectedState])

  return (
    <div className={handles['inst-stores--filterContainer']}>
      <p className={handles['inst-stores--filterTitle']}>{title}</p>
      {availableStates.length && (
        <select
          className={handles['inst-stores--select']}
          onChange={event => {
            setSelectedState(event.target.value)
            setSelectedCity('')
          }}
        >
          <option className={handles['inst-stores--option']} value="">
            Selecione um estado
          </option>
          {availableStates.map(state => {
            return (
              <option
                className={handles['inst-stores--option']}
                key={state}
                value={state}
              >
                {state}
              </option>
            )
          })}
        </select>
      )}
      {availableStates.length && (
        <select
          className={handles['inst-stores--select']}
          onChange={event => setSelectedCity(event.target.value)}
          disabled={!selectedState}
        >
          <option className={handles['inst-stores--option']} value="">
            Selecione uma cidade
          </option>
          {availableCities.length &&
            availableCities.map(city => {
              return (
                <option
                  className={handles['inst-stores--option']}
                  key={city}
                  value={city}
                >
                  {' '}
                  {city}{' '}
                </option>
              )
            })}
        </select>
      )}
    </div>
  )
}
