import { useEffect, useRef, useCallback } from 'react'

interface OpenCEPResponse {
  error?: boolean
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
}

const CepValidator = () => {
  const observerRef = useRef<MutationObserver | null>(null)
  const shippingTableObserverRef = useRef<MutationObserver | null>(null)
  const errorElRef = useRef<HTMLDivElement | null>(null)
  const cepIsValidRef = useRef<boolean>(false)

  const getInput = (): HTMLInputElement | null =>
    document.querySelector<HTMLInputElement>(
      'form.vtex-address-form__postalCode input[type="tel"]'
    )

  const getContainerInput = (): HTMLDivElement | null =>
    document.querySelector<HTMLDivElement>(
      'form.vtex-address-form__postalCode .vtex-input-prefix__group'
    )

  const getButton = (): HTMLButtonElement | null =>
    document.querySelector<HTMLButtonElement>(
      '[class*="shippingContainer"] button[type="submit"]'
    )

  const getShippingTable = (): HTMLElement | null =>
    document.querySelector<HTMLElement>(
      '.vtex-store-components-3-x-shippingTable'
    )

  const hideShippingTable = (): void => {
    const table = getShippingTable()
    if (!table) return
    table.style.display = 'none'
  }

  const showShippingTable = (): void => {
    const table = getShippingTable()
    if (!table) return
    table.style.display = ''
  }

  const injectErrorElement = (): void => {
    const input = getInput()
    if (!input || document.getElementById('cep-error-message')) return

    const div = document.createElement('div')
    div.id = 'cep-error-message'
    div.style.cssText = `
      font-size: 12px;
      margin-top: 4px;
      display: none;
      position: absolute;
    `

    const group = input.closest('.vtex-input-prefix__group')
    group
      ? group.insertAdjacentElement('afterend', div)
      : input.insertAdjacentElement('afterend', div)

    errorElRef.current = div
  }

  const getErrorEl = (): HTMLDivElement | null => {
    if (!errorElRef.current) {
      const el = document.getElementById('cep-error-message') as HTMLDivElement | null
      if (el) errorElRef.current = el
    }
    return errorElRef.current
  }

  const showError = useCallback((msg: string): void => {
    injectErrorElement()
    cepIsValidRef.current = false

    const input = getContainerInput()
    if (input) {
      input.style.border = '2px solid #e31c1c'
      input.style.borderRadius = '4px'
    }

    const errorEl = getErrorEl()
    if (!errorEl) return

    errorEl.textContent = msg
    errorEl.style.color = '#e31c1c'
    errorEl.style.display = 'block'

    hideShippingTable()
  }, [])

  const showLoading = useCallback((): void => {
    injectErrorElement()
    cepIsValidRef.current = false

    const errorEl = getErrorEl()
    if (!errorEl) return

    errorEl.textContent = 'Validando CEP...'
    errorEl.style.color = '#666'
    errorEl.style.display = 'block'
  }, [])

  const clearError = useCallback((): void => {
    const input = getContainerInput()
    if (input) {
      input.style.border = ''
      input.style.borderRadius = ''
    }

    const errorEl = getErrorEl()
    if (!errorEl) return

    errorEl.textContent = ''
    errorEl.style.display = 'none'
  }, [])

  // Observer dedicado à shippingTable — esconde imediatamente se CEP inválido
  const bindShippingTableObserver = useCallback((): void => {
    if (shippingTableObserverRef.current) return

    shippingTableObserverRef.current = new MutationObserver(() => {
      if (!cepIsValidRef.current) {
        hideShippingTable()
      }
    })

    shippingTableObserverRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }, [])

  const validateCEP = useCallback(async (): Promise<void> => {
    const input = getInput()
    if (!input) return

    const cep = input.value.replace(/\D/g, '')
    clearError()
    showLoading()

    try {
      const res = await fetch(`https://opencep.com/v1/${cep}`)
      const data: OpenCEPResponse = await res.json()

      if (data.error) {
        showError('CEP não encontrado. Verifique e tente novamente.')
      } else {
        cepIsValidRef.current = true
        clearError()
        showShippingTable()
      }
    } catch {
      showError('Não foi possível validar o CEP. Tente novamente.')
    }
  }, [showError, showLoading, clearError])

  const handleButtonClick = useCallback(
    (_e: Event): void => {
      validateCEP()
    },
    [validateCEP]
  )

  const bindButton = useCallback((): void => {
    const button = getButton()
    if (!button || button.dataset.cepBound) return

    button.dataset.cepBound = 'true'
    button.addEventListener('click', handleButtonClick, true)
  }, [handleButtonClick])

  useEffect(() => {
    observerRef.current = new MutationObserver(() => {
      bindButton()
      injectErrorElement()
    })

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    })

    bindButton()
    injectErrorElement()
    bindShippingTableObserver()

    return () => {
      observerRef.current?.disconnect()
      shippingTableObserverRef.current?.disconnect()
      shippingTableObserverRef.current = null

      const button = getButton()
      if (button) {
        button.removeEventListener('click', handleButtonClick, true)
        delete button.dataset.cepBound
      }

      document.getElementById('cep-error-message')?.remove()
      errorElRef.current = null
    }
  }, [bindButton, handleButtonClick, bindShippingTableObserver])

  return null
}

export default CepValidator