import { useIntl } from 'react-intl'
import { formatCurrency as formatCurrencyImport } from 'vtex.format-currency'
import { useRuntime } from 'vtex.render-runtime'

export const formatCurrency = (value: number) => {
  const { culture } = useRuntime()
  const intl = useIntl()

  const cultureFormatted = {
    ...culture,
    customCurrencySymbol: 'R$',
    customCurrencyDecimalDigits: 2
  }

  return formatCurrencyImport({
    intl, culture: cultureFormatted, value
  })

}
