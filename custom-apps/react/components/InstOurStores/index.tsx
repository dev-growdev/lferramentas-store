import React, { useEffect, useState } from 'react'

import { List } from './components/List'
import { Filters } from './components/Filter'

export function InstOurStores() {
  const [stores, setStores] = useState<Store[]>([])
  const [availableStates, setAvailableStates] = useState<string[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')

  useEffect(() => {
    fetch(
      `/api/dataentities/SL/search?_fields=nome,endereco,numero,complemento,bairro,cidade,estado,telefone,horario,latitude,longitude,storeActive,storeImage`
    )
      .then(res => res.json())
      .then(response => {
        setStores(response)
      })
      .catch(error => {
        console.error('Erro:', error)
      })
  }, [])

  if (!stores.length) return null

  const filteredItems = stores.filter(item => {
    if (selectedState && selectedCity) {
      return item.estado === selectedState && item.cidade === selectedCity
    }
    if (selectedState) {
      return item.estado === selectedState
    }
    return true
  })

  return (
    <>
      <Filters
        title={'Encontre a loja mais próxima'}
        stores={stores}
        setAvailableCities={setAvailableCities}
        setAvailableStates={setAvailableStates}
        setSelectedState={setSelectedState}
        setSelectedCity={setSelectedCity}
        selectedState={selectedState}
        availableCities={availableCities}
        availableStates={availableStates}
      />
      <List items={filteredItems} quantityOfItems={stores.length} />
    </>
  )
}
