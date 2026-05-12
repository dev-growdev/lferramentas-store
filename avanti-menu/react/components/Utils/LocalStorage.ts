export function localStorageExpires(key: string) {
  const currentDate = new Date().getTime(),
        data = localStorage.getItem(key),
        current = data && JSON.parse(data)

  if (current?.expires && current?.expires <= currentDate) {
    localStorage.removeItem(key)
  }
}

export function setLocalStorage(key: string, data: string, minutes: number) {
  const expires = new Date().getTime() + 60000 * minutes

  localStorage.setItem(key, JSON.stringify({
      data,
      expires,
    })
  )
}

export function getLocalStorage(key: string) {
  localStorageExpires(key)

  const value = localStorage.getItem(key),
        current = value ? JSON.parse(value) : null

  return current?.data
}
