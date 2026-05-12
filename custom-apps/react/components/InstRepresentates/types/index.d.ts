interface Representante {
  name: string
  email: string
  phone: string
  address: string
  neighborhood: string | null
  city: string
  state: string
}

interface ListProps {
  items: Representante[]
}

interface ItemProps {
  item: Representante
}

interface FilterProps {
  title: string
  representates: Representante[]
  setAvailableStates: React.Dispatch<React.SetStateAction<string[]>>
  setAvailableCities: React.Dispatch<React.SetStateAction<string[]>>
  setSelectedState: React.Dispatch<React.SetStateAction<string>>
  setSelectedCity: React.Dispatch<React.SetStateAction<string>>
  selectedState: string
  availableStates: string[]
  availableCities: string[]
}
