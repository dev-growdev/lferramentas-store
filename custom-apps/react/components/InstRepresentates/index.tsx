import React, { useEffect, useState } from 'react'

import { List } from './components/List'
import { Filters } from './components/Filter'

export function InstRepresentates() {
  const [representates, setRepresentates] = useState<Representante[]>([])
  const [availableStates, setAvailableStates] = useState<string[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')

  useEffect(() => {
    fetch(
      `/api/dataentities/RP/search?_fields=name,email,phone,address,neighborhood,city,state`,
      {
        headers: {
          'rest-range': 'resources=0-2000',
        },
      }
    )
      .then(res => res.json())
      .then(response => {
        setRepresentates(response)
      })
      .catch(error => {
        console.error('Erro:', error)
      })
  }, [])

  if (!representates.length) return null

  const filteredItems = representates.filter(item => {
    if (selectedState && selectedCity) {
      return item.state === selectedState && item.city === selectedCity
    }
    if (selectedState) {
      return item.state === selectedState
    }
    return true
  })

  return (
    <>
      <Filters
        title={'Encontre um representante'}
        representates={representates}
        setAvailableCities={setAvailableCities}
        setAvailableStates={setAvailableStates}
        setSelectedState={setSelectedState}
        setSelectedCity={setSelectedCity}
        selectedState={selectedState}
        availableCities={availableCities}
        availableStates={availableStates}
      />
      <List items={filteredItems} />
    </>
  )
}
