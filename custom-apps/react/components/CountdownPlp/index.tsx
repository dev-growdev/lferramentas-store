import React, { useEffect, useState } from 'react'
import style from './styles.css'

interface CountdownItem {
  targetDate: string // Exemplo: '2025-05-31 18:00:00'
  backgroundColor: string
  textColor: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownPlpProps {
  countdown?: CountdownItem
}

export const CountdownPlp: React.FC<CountdownPlpProps> & {
  schema: any
} = ({ countdown }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    if (!countdown) return

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const target = new Date(countdown.targetDate.replace(' ', 'T')).getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [countdown])

  const isCountdownExpired = (time: TimeLeft) => {
    return (
      time.days === 0 &&
      time.hours === 0 &&
      time.minutes === 0 &&
      time.seconds === 0
    )
  }

  if (!countdown || isCountdownExpired(timeLeft)) {
    return null
  }

  return (
    <div className={style.countdownContainer}>
      <div
        className={style.countdownPlpItem}
        style={{
          backgroundColor: countdown.backgroundColor,
        }}
      >
        <div className={style.countdownPlpContainer}>
          <div
            className={style.countdownPlpContainerLeft}
            style={{
              color: countdown.textColor,
            }}
          >
            <svg
              width="30"
              height="31"
              viewBox="0 0 30 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.88168 25.7383L6.91162 29.2929"
                stroke={countdown.textColor}
                stroke-width="1.69811"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M20.7051 25.7383L22.6751 29.2929"
                stroke={countdown.textColor}
                stroke-width="1.69811"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.794 27.3236C21.3235 27.3236 26.6167 22.0303 26.6167 15.5008C26.6167 8.97125 21.3235 3.67801 14.794 3.67801C8.26443 3.67801 2.97119 8.97125 2.97119 15.5008C2.97119 22.0303 8.26443 27.3236 14.794 27.3236Z"
                stroke={countdown.textColor}
                stroke-width="1.69811"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3.36599 12.3486C2.45834 11.6683 1.76558 10.7412 1.37038 9.67801C0.975185 8.61477 0.894235 7.46028 1.13719 6.3523C1.38015 5.24432 1.93676 4.22963 2.74059 3.42932C3.54443 2.629 4.56156 2.07686 5.67059 1.83878C6.77963 1.60069 7.93376 1.68671 8.99525 2.08658C10.0567 2.48645 10.9808 3.18327 11.6571 4.09391"
                stroke={countdown.textColor}
                stroke-width="1.69811"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.7939 3.67755L14.7941 1.70709"
                stroke={countdown.textColor}
                stroke-width="1.69811"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.7939 9.58951V15.5009"
                stroke={countdown.textColor}
                stroke-width="1.69811"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.7939 15.4997L18.9739 19.6797"
                stroke={countdown.textColor}
                stroke-width="1.69811"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M26.2208 12.3486C27.1284 11.6683 27.8212 10.7412 28.2164 9.67801C28.6116 8.61477 28.6925 7.46028 28.4496 6.3523C28.2066 5.24432 27.65 4.22963 26.8462 3.42932C26.0423 2.629 25.0252 2.07686 23.9162 1.83878C22.8071 1.60069 21.653 1.68671 20.5915 2.08658C19.53 2.48645 18.606 3.18327 17.9297 4.09391"
                stroke={countdown.textColor}
                stroke-width="1.69811"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            TERMINA EM:
          </div>
          <div className={style.countdownPlpContainerRight}>
            {['dia', 'hora', 'min', 'seg'].map((label, idx) => {
              const value = [
                timeLeft.days,
                timeLeft.hours,
                timeLeft.minutes,
                timeLeft.seconds,
              ][idx]

              const labelWithPlural =
                label === 'dia' || label === 'hora' ? `${label}(s)` : label

              return (
                <div key={label} className={style.countDownPlpNumbers}>
                  <div
                    className={style.countdownPlpNumberContent}
                    style={{
                      color: countdown.textColor,
                    }}
                  >
                    {value}
                  </div>
                  <div
                    className={style.countdownPlpText}
                    style={{
                      color: countdown.textColor,
                    }}
                  >
                    {labelWithPlural}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

CountdownPlp.schema = {
  title: 'Countdown PLP',
  description: 'Renderiza um único countdown baseado em configurações.',
  type: 'object',
  properties: {
    countdown: {
      title: 'Configurações do Countdown',
      type: 'object',
      properties: {
        targetDate: {
          title: 'Data de término',
          type: 'string',
          description: 'Formato: YYYY-MM-DD HH:mm:ss (ex: 2025-05-31 18:00:00)',
          default: '',
        },
        backgroundColor: {
          title: 'Cor do background',
          type: 'string',
          default: '#000',
        },
        textColor: {
          title: 'Cor dos textos',
          type: 'string',
          default: '#FFE72E',
        },
      },
    },
  },
}
