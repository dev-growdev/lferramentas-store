import { ProductTypes } from 'vtex.product-context'

function applyFiltersToInstallmentsList(
    installmentsList: ProductTypes.Installment[],
    filteringRules: {
        paymentSystemName?: string
        installmentsQuantity?: number
    }
) {
    let filteredInstallmentsList = installmentsList

    if (filteringRules.paymentSystemName) {
        filteredInstallmentsList = filteredInstallmentsList.filter(
            installmentsOption =>
                installmentsOption.PaymentSystemName ===
                filteringRules.paymentSystemName
        )
    }

    if (filteringRules.installmentsQuantity) {
        filteredInstallmentsList = filteredInstallmentsList.filter(
            installmentsOption =>
                installmentsOption.NumberOfInstallments ===
                filteringRules.installmentsQuantity
        )
    }

    return filteredInstallmentsList
}

export function pickMaxInstallmentsOption(
    installmentsList: ProductTypes.Installment[],
    filteringRules?: {
        paymentSystemName?: string
        installmentsQuantity?: number
    }
) {
    const filteredInstallmentsList = filteringRules
        ? applyFiltersToInstallmentsList(installmentsList, filteringRules)
        : installmentsList

    let [maxInstallmentOption] = filteredInstallmentsList

    filteredInstallmentsList.forEach(installmentOption => {
        if (
            installmentOption.NumberOfInstallments >
            maxInstallmentOption.NumberOfInstallments
        ) {
            maxInstallmentOption = installmentOption
        }
    })

    return maxInstallmentOption
}

export function pickMaxInstallmentsOptionWithoutInterest(
    installmentsList: ProductTypes.Installment[],
    filteringRules?: {
      paymentSystemName?: string
      installmentsQuantity?: number
    }
  ) {
    const installmentsWithoutInterest = installmentsList.filter(
      installmentsOption => installmentsOption.InterestRate === 0
    )
  
    // There aren't any no-interest options
    if (installmentsWithoutInterest.length === 0) {
      return pickMaxInstallmentsOption(installmentsList, filteringRules)
    }
  
    return pickMaxInstallmentsOption(installmentsWithoutInterest, filteringRules)
  }