import React, { useEffect, useState } from 'react'
import styles from './styles.css'

interface TimerBfProps {
  targetDate: string // A data no formato 'YYYY-MM-DDTHH:MM:SS'
}

const TimerBf: React.FC<TimerBfProps> & { schema: any } = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const countdown = setInterval(() => {
      const target = new Date(targetDate).getTime()
      const now = new Date().getTime()
      const difference = target - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        )
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        clearInterval(countdown)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(countdown)
  }, [targetDate])

  return (
    <div>
      <div className={styles.timerBfContainer}>
        <div className={styles.timerBfNumbers}>
          <div className={styles.timerBfNumbersContent}>{timeLeft.days}</div>
          <div className={styles.timerBfText}>dias</div>
        </div>
        <div className={styles.timerBfNumbers}>
          <div className={styles.timerBfNumbersContent}>{timeLeft.hours}</div>
          <div className={styles.timerBfText}>horas</div>
        </div>
        <div className={styles.timerBfNumbers}>
          <div className={styles.timerBfNumbersContent}>{timeLeft.minutes}</div>
          <div className={styles.timerBfText}>minutos</div>
        </div>
        <div className={styles.timerBfNumbers}>
          <div className={styles.timerBfNumbersContent}>{timeLeft.seconds}</div>
          <div className={styles.timerBfText}>segundos</div>
        </div>
      </div>
    </div>
  )
}

// Definindo o schema para que o campo seja editável no Site Editor
TimerBf.schema = {
  title: 'Countdown Timer',
  description: 'Um componente de contagem regressiva para uma data específica.',
  type: 'object',
  properties: {
    targetDate: {
      title: 'Data Alvo',
      description:
        'Selecione a data e hora para iniciar a contagem regressiva.',
      type: 'string',
      widget: {
        'ui:widget': 'datetime',
      },
    },
  },
}

export default TimerBf
