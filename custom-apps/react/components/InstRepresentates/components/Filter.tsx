import React, { useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { CSS_HANDLES } from '../CSS_HANDLES'

export const Filters: React.FC<FilterProps> = ({
  title,
  setAvailableStates,
  setAvailableCities,
  setSelectedState,
  setSelectedCity,
  selectedState,
  availableStates,
  availableCities,
  representates,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    const states = representates
      .map(item => item.state)
      .filter((item, index, self) => self.indexOf(item) === index)

    setAvailableStates(states)
  }, [representates])

  useEffect(() => {
    if (!selectedState) {
      setAvailableCities([])
      return 
    }

    if (selectedState) {
      const cities = representates
        .filter(item => item.state === selectedState)
        .map(item => item.city)
        .filter((item, index, self) => self.indexOf(item) === index)

      setAvailableCities(cities)
    }
  }, [selectedState])

  return (
    <div className={handles['inst-representantes--filterContainer']}>
      <p className={handles['inst-representantes--filterTitle']}>{title}</p>
      {availableStates.length && (
        <select
          className={handles['inst-representantes--select']}
          onChange={event => {
            setSelectedState(event.target.value)
            setSelectedCity('')
          }}
        >
          <option className={handles['inst-representantes--option']} value="">
            Selecione um estado
          </option>
          {availableStates.map(state => {
            return (
              <option
                className={handles['inst-representantes--option']}
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
          className={handles['inst-representantes--select']}
          onChange={event => setSelectedCity(event.target.value)}
          disabled={!selectedState}
        >
          <option className={handles['inst-representantes--option']} value="">
            Selecione uma cidade
          </option>
          {availableCities.length &&
            availableCities.map(city => {
              return (
                <option
                  className={handles['inst-representantes--option']}
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
