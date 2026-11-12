import React, { useEffect, useState } from 'react'
import { useApolloClient } from 'react-apollo'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useOrderQueue } from 'vtex.order-manager/OrderQueue'
import QueryOrderForm from 'vtex.checkout-resources/QueryOrderForm'
import { useProduct } from 'vtex.product-context'

import { pdpInteractiveCouponSchema } from './schema'
import { resolveCoupon } from './resolveCoupon'
import type { CouponConfig } from './resolveCoupon'
import styles from './styles.css'

interface PdpInteractiveCouponProps {
  /** Cupons configurados no Site Editor, vinculados a coleções e com agendamento */
  coupons?: CouponConfig[]
}

// Reavalia o agendamento periodicamente para o cupom aparecer/expirar sem recarregar a página.
const SCHEDULING_CHECK_INTERVAL_MS = 60 * 1000

const QUEUE_TASK_ID = 'pdp-interactive-coupon'

type CouponStatus = 'idle' | 'loading' | 'applied' | 'error'

interface CheckoutMessage {
  code?: string
  text?: string
  status?: string
}

interface RestOrderForm {
  marketingData?: { coupon?: string | null } | null
  messages?: CheckoutMessage[]
}

const ERROR_MESSAGES: Record<string, string> = {
  couponNotFound: 'Cupom inválido ou expirado.',
  couponExpired: 'Este cupom expirou.',
}

const DEFAULT_ERROR_MESSAGE =
  'Não foi possível aplicar o cupom. Tente novamente.'

const normalize = (code?: string | null) => (code ?? '').trim().toUpperCase()

const applyCoupon = async (orderFormId: string, couponCode: string) => {
  const response = await fetch(
    `/api/checkout/pub/orderForm/${orderFormId}/coupons`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ text: couponCode }),
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to apply coupon (status ${response.status})`)
  }

  return (await response.json()) as RestOrderForm
}

// A API responde 200 mesmo quando o cupom é recusado; o motivo vem em `messages`.
const getCouponError = (orderForm: RestOrderForm, couponCode: string) => {
  const couponMessage = orderForm.messages?.find(
    ({ code, status }) =>
      status === 'error' || (code && code.toLowerCase().includes('coupon'))
  )

  if (couponMessage) {
    return (
      (couponMessage.code && ERROR_MESSAGES[couponMessage.code]) ||
      DEFAULT_ERROR_MESSAGE
    )
  }

  if (normalize(orderForm.marketingData?.coupon) !== normalize(couponCode)) {
    return DEFAULT_ERROR_MESSAGE
  }

  return null
}

const PdpInteractiveCoupon = ({ coupons = [] }: PdpInteractiveCouponProps) => {
  const productContext = useProduct()

  // `now` só é definido no client: a PDP pode vir do cache do SSR, então o
  // agendamento precisa ser avaliado com o horário real do navegador.
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())

    const interval = setInterval(
      () => setNow(new Date()),
      SCHEDULING_CHECK_INTERVAL_MS
    )

    return () => clearInterval(interval)
  }, [])

  const matchedCoupon = now
    ? resolveCoupon(coupons, productContext?.product, now)
    : null

  const couponCode = normalize(matchedCoupon?.couponCode)

  const { orderForm, setOrderForm, loading: orderFormLoading } = useOrderForm()
  const { enqueue } = useOrderQueue()
  const apolloClient = useApolloClient()
  const [status, setStatus] = useState<CouponStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const currentCoupon: string | undefined = orderForm?.marketingData?.coupon
  const isCouponActive = !!couponCode && normalize(currentCoupon) === couponCode

  // Reflete o cupom já ativo no orderForm (ex: cliente voltando à PDP) e
  // volta ao estado padrão se outro cupom o substituir.
  useEffect(() => {
    if (status === 'loading') return

    if (isCouponActive) {
      setStatus('applied')
      setErrorMessage(null)
    } else if (status === 'applied') {
      setStatus('idle')
    }
  }, [isCouponActive]) // eslint-disable-line react-hooks/exhaustive-deps

  // Limpa um erro anterior quando o cupom muda (ex: navegação entre produtos).
  useEffect(() => {
    setErrorMessage(null)
    setStatus(isCouponActive ? 'applied' : 'idle')
  }, [couponCode]) // eslint-disable-line react-hooks/exhaustive-deps

  // O orderForm do order-manager segue o schema GraphQL, diferente da resposta
  // REST. Por isso rebuscamos via GraphQL para não quebrar minicart/totalizers.
  const refreshOrderForm = async () => {
    const { data } = await apolloClient.query({
      query: QueryOrderForm,
      fetchPolicy: 'network-only',
    })

    if (data?.orderForm) {
      setOrderForm(data.orderForm)
    }
  }

  const handleApply = async () => {
    if (
      !couponCode ||
      status === 'loading' ||
      status === 'applied' ||
      !orderForm?.id
    ) {
      return
    }

    setStatus('loading')
    setErrorMessage(null)

    try {
      // Regra nativa VTEX: um cupom por orderForm, este substitui o anterior.
      const updatedOrderForm: RestOrderForm = await enqueue(
        () => applyCoupon(orderForm.id, couponCode),
        QUEUE_TASK_ID
      )

      const couponError = getCouponError(updatedOrderForm, couponCode)

      await refreshOrderForm()

      if (couponError) {
        setStatus('error')
        setErrorMessage(couponError)

        return
      }

      setStatus('applied')
    } catch (error) {
      if ((error as { code?: string })?.code === 'TASK_CANCELLED') {
        setStatus('idle')

        return
      }

      console.error('Error applying coupon:', error)
      setStatus('error')
      setErrorMessage(DEFAULT_ERROR_MESSAGE)
    }
  }

  if (!couponCode) return null

  const isLoading = status === 'loading'
  const isApplied = status === 'applied'
  const isDisabled = isLoading || isApplied || orderFormLoading

  const containerClass = [
    styles.container,
    isLoading && styles.containerLoading,
    isApplied && styles.containerApplied,
    status === 'error' && styles.containerError,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClass}>
      <button
        type="button"
        className={styles.coupon}
        onClick={handleApply}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-label={
          isApplied
            ? `Cupom ${couponCode} aplicado`
            : `Aplicar cupom ${couponCode}`
        }
      >
        {isApplied ? (
          <span className={styles.appliedLabel}>
            <span className={styles.checkIcon} aria-hidden="true">
              ✓
            </span>
            Cupom aplicado
          </span>
        ) : (
          <>
            <span className={styles.tag}>
              {isLoading ? 'Aplicando...' : 'Aplicar cupom'}
            </span>
            <span className={styles.code}>{couponCode}</span>
          </>
        )}
      </button>

      {status === 'error' && errorMessage && (
        <p className={styles.errorMessage} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

PdpInteractiveCoupon.schema = pdpInteractiveCouponSchema

export default PdpInteractiveCoupon
