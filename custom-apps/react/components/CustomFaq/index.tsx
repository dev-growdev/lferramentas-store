import React, { MouseEvent, useState } from "react"
import ReactMarkdown from "react-markdown"
import { applyModifiers, useCssHandles } from "vtex.css-handles"
import { useCustomFaq } from "../../contexts/CustomFaqContext"
import { CustomFaqQuestionsProps } from "../../typings/types"
import { cssHandles } from "./handles"
import { Icon } from "./icon"

const CustomFaqQuestions = () => {
  const [clickedCommon, setClickedCommon] = useState<number>(-2)
  const { questions, direction, justify, align, closePrev } = useCustomFaq()
  const { handles: css } = useCssHandles(cssHandles)

  const handleClickCommon = (event: MouseEvent, index: number, css: string) => {
    event.persist()
    const currentTarget = event.currentTarget
    currentTarget.parentElement?.classList.toggle(css)

    if (clickedCommon === index) {
      return setClickedCommon(-2)
    }

    setClickedCommon(index)
  }

  const styles = {
    flex: {
      justifyContent: justify || "space-between",
      flexDirection: direction as "row",
      alignItems: align
    },
  } as const

  return (
    <div className={css['customFaq-container']}>
      {questions?.map(({ __editorItemTitle, response, colorQ, colorR, colorQIcon }: CustomFaqQuestionsProps, index) => (
        <div
          className={applyModifiers(css["customFaq-containerQuestions"], [
            closePrev && clickedCommon === index ? "Active" : "",
          ])}
          key={__editorItemTitle}
        >
          <h3
            className={css["customFaq-QuestionsTitle"]}
            style={{ ...styles.flex, color: colorQ }}
            onClick={(event) =>
              handleClickCommon(event, index, css["customFaq-containerQuestions--Active"])
            }
          >
            <span className={css["customFaq-QuestionsTitleContent"]}>
              <ReactMarkdown>{__editorItemTitle}</ReactMarkdown>
            </span>
            <Icon colorQ={colorQIcon ? colorQ : ""} />
          </h3>
          {
            clickedCommon !== -2 && (
              <div className={css["customFaq-containerQuestion"]}>
                <p className={css["customFaq-ResponseText"]} style={{ color: colorR }} >
                  <ReactMarkdown>{response}</ReactMarkdown>
                </p>
              </div>
            )
          }

        </div>
      ))}
    </div>
  )
}

export default CustomFaqQuestions
