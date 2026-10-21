import React, { useEffect, useState } from 'react'
import style from './styles.css'

interface ShelfCountdownProps {
  targetDate?: string // Exemplo: '2025-11-28 23:59:59'
  hideWhenExpired?: boolean
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const EMPTY_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }

const getTimeLeft = (targetDate: string): TimeLeft => {
  const target = new Date(targetDate.replace(' ', 'T')).getTime()
  const difference = target - new Date().getTime()

  if (Number.isNaN(difference) || difference <= 0) {
    return EMPTY_TIME
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  }
}

const isExpired = (time: TimeLeft) =>
  time.days === 0 &&
  time.hours === 0 &&
  time.minutes === 0 &&
  time.seconds === 0

const pad = (value: number) => (value < 10 ? `0${value}` : String(value))

export const ShelfCountdown: React.FC<ShelfCountdownProps> & {
  schema: any
} = ({ targetDate, hideWhenExpired = true }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(EMPTY_TIME)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (!targetDate) return

    setTimeLeft(getTimeLeft(targetDate))
    setIsMounted(true)

    const interval = setInterval(() => {
      const next = getTimeLeft(targetDate)

      setTimeLeft(next)

      if (isExpired(next)) clearInterval(interval)
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (!targetDate) return null

  // Evita piscar o contador zerado antes do primeiro cálculo no client
  if (hideWhenExpired && (!isMounted || isExpired(timeLeft))) return null

  const units = [
    { value: timeLeft.days, label: 'dias' },
    { value: timeLeft.hours, label: 'horas' },
    { value: timeLeft.minutes, label: 'minutos' },
    { value: timeLeft.seconds, label: 'segundos' },
  ]

  return (
    <div className={style.shelfCountdownContainer}>
      <svg
        className={style.shelfCountdownIcon}
        width="30"
        height="31"
        viewBox="0 0 30 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g
          stroke="currentColor"
          strokeWidth="1.69811"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8.88168 25.7383L6.91162 29.2929" />
          <path d="M20.7051 25.7383L22.6751 29.2929" />
          <path d="M14.794 27.3236C21.3235 27.3236 26.6167 22.0303 26.6167 15.5008C26.6167 8.97125 21.3235 3.67801 14.794 3.67801C8.26443 3.67801 2.97119 8.97125 2.97119 15.5008C2.97119 22.0303 8.26443 27.3236 14.794 27.3236Z" />
          <path d="M3.36599 12.3486C2.45834 11.6683 1.76558 10.7412 1.37038 9.67801C0.975185 8.61477 0.894235 7.46028 1.13719 6.3523C1.38015 5.24432 1.93676 4.22963 2.74059 3.42932C3.54443 2.629 4.56156 2.07686 5.67059 1.83878C6.77963 1.60069 7.93376 1.68671 8.99525 2.08658C10.0567 2.48645 10.9808 3.18327 11.6571 4.09391" />
          <path d="M14.7939 3.67755L14.7941 1.70709" />
          <path d="M14.7939 9.58951V15.5009" />
          <path d="M14.7939 15.4997L18.9739 19.6797" />
          <path d="M26.2208 12.3486C27.1284 11.6683 27.8212 10.7412 28.2164 9.67801C28.6116 8.61477 28.6925 7.46028 28.4496 6.3523C28.2066 5.24432 27.65 4.22963 26.8462 3.42932C26.0423 2.629 25.0252 2.07686 23.9162 1.83878C22.8071 1.60069 21.653 1.68671 20.5915 2.08658C19.53 2.48645 18.606 3.18327 17.9297 4.09391" />
        </g>
      </svg>
      {units.map(({ value, label }) => (
        <div key={label} className={style.shelfCountdownItem}>
          <span className={style.shelfCountdownNumber}>{pad(value)}</span>
          <span className={style.shelfCountdownLabel}>{label}</span>
        </div>
      ))}
    </div>
  )
}

ShelfCountdown.schema = {
  title: 'Cronômetro da vitrine',
  description: 'Contagem regressiva exibida ao lado do título da vitrine.',
  type: 'object',
  properties: {
    targetDate: {
      title: 'Data de término',
      type: 'string',
      description: 'Formato: YYYY-MM-DD HH:mm:ss (ex: 2025-11-28 23:59:59)',
      default: '',
    },
    hideWhenExpired: {
      title: 'Ocultar quando a contagem terminar',
      type: 'boolean',
      default: true,
    },
  },
}
