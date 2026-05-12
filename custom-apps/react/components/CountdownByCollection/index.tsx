import React, { useEffect, useState, useMemo } from 'react'
import { useProduct } from 'vtex.product-context'
import style from './styles.css'

interface CountdownItem {
  collectionId: string
  targetDate: string // Exemplo: '2025-05-31 18:00:00'
  titleCountdownTop: string
  fontSizeTitleTopDesk: string
  fontSizeTitleTopMob: string
  fontWeightTop: number
  titleCountdownDown: string
  fontSizeTitleDownDesk: string
  fontSizeTitleDownMob: string
  fontWeightDown: number
  backgroundImageDesktop: string
  backgroundImageMobile: string
  textColor: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownByCollectionProps {
  countdowns?: CountdownItem[]
}

export const CountdownByCollection: React.FC<CountdownByCollectionProps> & {
  schema: any
} = ({ countdowns = [] }) => {
  const productContext = useProduct()

  const productCollections =
    productContext?.product?.productClusters?.map(cluster => cluster.id) || []

  const activeCountdowns = useMemo(() => {
    return countdowns.filter(cd => productCollections.includes(cd.collectionId))
  }, [countdowns, productCollections])

  const [timeLeft, setTimeLeft] = useState<Record<number, TimeLeft>>({})

  useEffect(() => {
    if (activeCountdowns.length === 0) return

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const updated: Record<number, TimeLeft> = {}

      activeCountdowns.forEach((item, index) => {
        const localTarget = new Date(
          item.targetDate.replace(' ', 'T')
        ).getTime()
        const difference = localTarget - now

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          )
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          )
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)
          updated[index] = { days, hours, minutes, seconds }
        } else {
          updated[index] = { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }
      })

      setTimeLeft(updated)
    }, 1000)

    return () => clearInterval(interval)
  }, [activeCountdowns])

  const isCountdownExpired = (time: TimeLeft) => {
    return (
      time.days === 0 &&
      time.hours === 0 &&
      time.minutes === 0 &&
      time.seconds === 0
    )
  }

  if (activeCountdowns.length === 0) {
    return null
  }

  return (
    <div className={style.countdownContainer}>
      {activeCountdowns.map((item, index) => {
        const time = timeLeft[index] || {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }

        if (isCountdownExpired(time)) {
          return null
        }

        return (
          <div
            key={index}
            className={style.countdownItem}
            style={{
              backgroundImage: typeof window !== 'undefined' && window.innerWidth <= 1024
              ? `url(${item.backgroundImageMobile})`
              : `url(${item.backgroundImageDesktop})`
            }}
          >
            <div className={style.countdownPdpTitle}>
              <div>
                <p
                  className={style.titleCountdownPdpTop}
                  style={{
                    color: item.textColor,
                    fontSize:
                      typeof window !== 'undefined' && window.innerWidth <= 1024
                        ? item.fontSizeTitleTopMob
                        : item.fontSizeTitleTopDesk,
                    fontWeight: item.fontWeightTop,
                  }}
                >
                  {item.titleCountdownTop}
                </p>
                <p
                  className={style.titleCountdownPdpDown}
                  style={{
                    color: item.textColor,
                    fontSize:
                      typeof window !== 'undefined' && window.innerWidth <= 1024
                        ? item.fontSizeTitleDownMob
                        : item.fontSizeTitleDownDesk,
                    fontWeight: item.fontWeightDown,
                  }}
                >
                  {item.titleCountdownDown}
                </p>
              </div>
            </div>
            <div className={style.countdownPdpContainer}>
              <div
                className={style.countdownPdpContainerTop}
                style={{
                  color: item.textColor,
                }}
              >
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.84534 18.8224L5.38428 21.4586"
                    stroke={item.textColor}
                    stroke-width="1.25938"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15.6143 18.8224L17.0753 21.4586"
                    stroke={item.textColor}
                    stroke-width="1.25938"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.2301 19.9981C16.0727 19.9981 19.9983 16.0724 19.9983 11.2299C19.9983 6.38735 16.0727 2.46169 11.2301 2.46169C6.38757 2.46169 2.46191 6.38735 2.46191 11.2299C2.46191 16.0724 6.38757 19.9981 11.2301 19.9981Z"
                    stroke={item.textColor}
                    stroke-width="1.25938"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2.75471 8.89216C2.08156 8.38762 1.56778 7.70006 1.27469 6.91152C0.981596 6.12299 0.921561 5.26678 1.10175 4.44505C1.28193 3.62333 1.69473 2.87081 2.29089 2.27727C2.88704 1.68372 3.64138 1.27424 4.46388 1.09766C5.28639 0.921088 6.14233 0.984886 6.92957 1.28144C7.71681 1.578 8.4021 2.09479 8.90368 2.77015"
                    stroke={item.textColor}
                    stroke-width="1.25938"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.23 2.46136L11.2301 1"
                    stroke={item.textColor}
                    stroke-width="1.25938"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.23 6.8459V11.23"
                    stroke={item.textColor}
                    stroke-width="1.25938"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.23 11.2291L14.33 14.3291"
                    stroke={item.textColor}
                    stroke-width="1.25938"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M19.7046 8.89216C20.3778 8.38762 20.8916 7.70006 21.1847 6.91152C21.4777 6.12299 21.5378 5.26678 21.3576 4.44505C21.1774 3.62333 20.7646 2.87081 20.1685 2.27726C19.5723 1.68372 18.818 1.27424 17.9955 1.09766C17.173 0.921088 16.317 0.984886 15.5298 1.28144C14.7425 1.578 14.0572 2.09479 13.5557 2.77015"
                    stroke={item.textColor}
                    stroke-width="1.25938"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                TERMINA EM:
              </div>
              <div className={style.countdownPdpContainerBottom}>
                {time.days > 0 && (
                  <div className={style.timerBfNumbers}>
                    <div
                      className={style.countdownPdpNumberContent}
                      style={{
                        color: item.textColor,
                      }}
                    >
                      {time.days}
                    </div>
                    <div
                      className={style.countdownPdpText}
                      style={{
                        color: item.textColor,
                      }}
                    >
                      dia(s)
                    </div>
                  </div>
                )}
                <div className={style.timerBfNumbers}>
                  <div
                    className={style.countdownPdpNumberContent}
                    style={{
                      color: item.textColor,
                    }}
                  >
                    {time.hours}
                  </div>
                  <div
                    className={style.countdownPdpText}
                    style={{
                      color: item.textColor,
                    }}
                  >
                    hora(s)
                  </div>
                </div>
                <div className={style.timerBfNumbers}>
                  <div
                    className={style.countdownPdpNumberContent}
                    style={{
                      color: item.textColor,
                    }}
                  >
                    {time.minutes}
                  </div>
                  <div
                    className={style.countdownPdpText}
                    style={{
                      color: item.textColor,
                    }}
                  >
                    min
                  </div>
                </div>
                <div className={style.timerBfNumbers}>
                  <div
                    className={style.countdownPdpNumberContent}
                    style={{
                      color: item.textColor,
                    }}
                  >
                    {time.seconds}
                  </div>
                  <div
                    className={style.countdownPdpText}
                    style={{
                      color: item.textColor,
                    }}
                  >
                    seg
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

CountdownByCollection.schema = {
  title: 'Countdown por coleção',
  description: 'Renderiza múltiplos countdowns baseados em coleção.',
  type: 'object',
  properties: {
    countdowns: {
      title: 'Countdowns por coleção',
      type: 'array',
      items: {
        type: 'object',
        title: 'Countdown',
        properties: {
          __editorItemTitle: {
            title: 'ID de visualização',
            description: 'Só será visível no site editor',
            type: 'string',
          },
          collectionId: {
            title: 'ID da coleção',
            type: 'string',
            default: '',
          },
          targetDate: {
            title: 'Data de término',
            type: 'string',
            description:
              'Formato: YYYY-MM-DD HH:mm:ss (ex: 2025-05-31 18:00:00)',
            default: '',
          },
          backgroundImageDesktop: {
            title: 'Imagem de background desktop',
            type: 'string',
            default: '',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          backgroundImageMobile: {
            title: 'Imagem background mobile',
            type: 'string',
            default: '',
            widget: {
              'ui:widget': 'image-uploader',
            }
          },
          titleCountdownTop: {
            title: 'Título do countdown em cima',
            type: 'string',
            description: 'Título a esquerda do countdown (parte de cima)',
            default: 'oferta',
          },
          fontSizeTitleTopDesk: {
            title: 'Font size do texto de cima DESKTOP',
            type: 'string',
            description: 'Tamanho do texto de cima (ex: 13px)',
            default: '',
          },
          fontSizeTitleTopMob: {
            title: 'Font size do texto de cima MOBILE',
            type: 'string',
            description: 'Tamanho do texto de cima (ex: 10px)',
            default: '',
          },
          fontWeightTop: {
            title: 'Peso da fonte de cima',
            type: 'number',
            description: 'Peso da fonte de cima (ex: 600)',
            default: 600,
          },
          titleCountdownDown: {
            title: 'Título do countdown em baixo',
            type: 'string',
            description: 'Título a esquerda do countdown (parte debaixo)',
            default: 'RELÂMPAGO',
          },
          fontSizeTitleDownDesk: {
            title: 'Font size do texto de baixo DESK',
            type: 'string',
            description: 'Tamanho do texto de baixo (ex: 31px)',
            default: '',
          },
          fontSizeTitleDownMob: {
            title: 'Font size do texto de baixo MOBILE',
            type: 'string',
            description: 'Tamanho do texto de baixo (ex: 23px)',
            default: '',
          },
          fontWeightDown: {
            title: 'Peso da fonte de baixo',
            type: 'number',
            description: 'Peso da fonte de baixo (ex: 800)',
            default: 800,
          },
          textColor: {
            title: 'Cor dos textos',
            type: 'string',
            description: 'Cor dos textos do countdown',
            default: '',
          },
        },
      },
    },
  },
}
