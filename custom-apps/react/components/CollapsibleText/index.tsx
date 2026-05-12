import React, { useState, useRef, useEffect } from 'react'
import { index as MemoizedRichText } from 'vtex.rich-text'
import { useRuntime } from 'vtex.render-runtime'
import styles from './style.css'

interface ICollapsibleTextProps {
  showContent: boolean
  title: string
  subtitle: string
  text: string
  collapsedContent: CollapsedContent[]
}

type CollapsedContent = {
  collapsedTitle: string
  collapsedText: string
}

const CollapsibleText = ({
  showContent,
  title,
  subtitle,
  text,
  collapsedContent,
}: ICollapsibleTextProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [clientHeight, setClientHight] = useState(0)
  const [scrollHeight, setScrollHeight] = useState(0)

  const textRef = useRef<HTMLDivElement>(null)

  const { deviceInfo } = useRuntime()

  function handleToggleText() {
    setIsCollapsed(!isCollapsed)
  }

  useEffect(() => {
    setClientHight(textRef.current?.clientHeight ?? 0)
    setScrollHeight(textRef.current?.scrollHeight ?? 0)
  }, [textRef])

  const isCollapsible =
    collapsedContent?.length > 0
      ? true
      : scrollHeight == clientHeight &&
        scrollHeight >= 90 &&
        text?.length > 600 &&
        deviceInfo.isMobile
      ? text?.length >= 600
      : text?.length >= 600

  return showContent ? (
    <div className={styles['clps-container']}>
      <div className={styles['clps-content']}>
        <div className={styles['clps-main-title-container']}>
          <MemoizedRichText text={title ? title : ''} />
        </div>

        <div className={styles['clps-subtitle-container']}>
          <MemoizedRichText text={subtitle ? subtitle : ''} />
        </div>

        <div className={styles['clps-main-text-wrapper']}>
          <div
            ref={textRef}
            className={`${styles['clps-text']} ${
              isCollapsed ? styles['clps-collapsed'] : ''
            }`}
          >
            <MemoizedRichText text={text ? text : ''} />
          </div>
        </div>

        {isCollapsed ? null : (
          <>
            <div>
              {collapsedContent?.map((collapsedContent: CollapsedContent) => {
                return (
                  <div
                    key={collapsedContent?.collapsedTitle}
                    className={styles['clps-content--02']}
                  >
                    <div className={styles['clps-title-container']}>
                      <MemoizedRichText
                        text={
                          collapsedContent.collapsedTitle
                            ? collapsedContent.collapsedTitle
                            : ''
                        }
                      />
                    </div>

                    <MemoizedRichText
                      text={
                        collapsedContent.collapsedText
                          ? collapsedContent.collapsedText
                          : ''
                      }
                    />
                  </div>
                )
              })}
            </div>
          </>
        )}

        {isCollapsible && (
          <button
            type="button"
            onClick={handleToggleText}
            className={styles['clps-button']}
          >
            {isCollapsed ? 'Ver mais' : 'Ver menos'}
          </button>
        )}
      </div>
    </div>
  ) : null
}

CollapsibleText.schema = {
  title: 'Texto Colapsível SEO',
  type: 'object',
  description: 'Conteúdo SEO Primeiro Nível',
  properties: {
    showContent: {
      title: 'Mostrar Conteúdo SEO',
      type: 'boolean',
      default: false,
    },
    title: {
      title: 'Titulo SEO',
      type: 'string',
    },
    subtitle: {
      title: 'Subtítulo SEO',
      type: 'string',
    },
    text: {
      title:
        'Texto SEO Primeiro Nível, esse texto precisará ser adicionado apenas com o máximo de 1(um) espaço entre os parágrafos desejados para o correto funcionamento do botão de Ver mais/Ver menos',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    collapsedContent: {
      title: 'Conteúdos SEO Segundo Nível',
      type: 'array',
      description: 'Conteúdos SEO que serão exibidos ao clicar no botão',
      items: {
        title: 'collapsedContent',
        type: 'object',
        properties: {
          collapsedTitle: {
            title: 'Titulo SEO',
            type: 'string',
          },
          collapsedText: {
            title: 'Texto SEO',
            type: 'string',
            widget: {
              'ui:widget': 'textarea',
            },
          },
        },
      },
    },
  },
}

export default CollapsibleText
