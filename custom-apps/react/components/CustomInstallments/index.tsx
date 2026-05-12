import React from 'react'
import { useProduct } from 'vtex.product-context'
import { pickMaxInstallmentsOptionWithoutInterest } from './modules/installments'
import { formatCurrency } from '../../utils/pricePix'
import { getDefaultSeller } from '../ProductSummaryImage/modules/seller'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
    'installments',
    'number-of-installments',
    'installments-value'
] as const

export const CustomInstallments = () => {
    const handles = useCssHandles(CSS_HANDLES)
    const productCtx = useProduct()
    const seller = getDefaultSeller(productCtx?.selectedItem?.sellers)
    const unitMultiplier = productCtx?.product?.items[0].unitMultiplier ?? 1


    if (
        !seller?.commertialOffer?.Installments ||
        seller?.commertialOffer?.Installments?.length === 0
    ) {
        return null
    }

    const installments = pickMaxInstallmentsOptionWithoutInterest(seller?.commertialOffer.Installments)
    const installmentsTotalValueWithoutUnitMultiplier = installments.TotalValuePlusInterestRate / unitMultiplier
    const installmentsValue = installmentsTotalValueWithoutUnitMultiplier / installments.NumberOfInstallments



    return (
        <div>
            <span className={handles.handles['installments']}>Ou em até <span className={handles.handles['number-of-installments']}>{installments.NumberOfInstallments}x</span> de <span className={handles.handles['installments-value']}>{formatCurrency(installmentsValue)}</span></span>
        </div>
    )
}