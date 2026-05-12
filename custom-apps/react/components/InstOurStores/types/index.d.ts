interface Store {
  nome: string
  endereco: string
  numero: string
  complemento: string | null
  bairro: string
  cidade: string
  estado: string
  telefone: string
  horario: string
  latitude: number | null
  longitude: number | null
  storeActive: boolean
  storeImage: string | null
}

interface ListStoreProps {
  items: Store[]
  quantityOfItems: number
}

interface ItemProps {
  item: Store
}

interface FilterStoreProps {
  title: string
  stores: Store[]
  setAvailableStates: React.Dispatch<React.SetStateAction<string[]>>
  setAvailableCities: React.Dispatch<React.SetStateAction<string[]>>
  setSelectedState: React.Dispatch<React.SetStateAction<string>>
  setSelectedCity: React.Dispatch<React.SetStateAction<string>>
  selectedState: string
  availableStates: string[]
  availableCities: string[]
}
