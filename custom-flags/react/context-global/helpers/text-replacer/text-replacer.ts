import { DataRefined, FieldDiscountDataRefined } from "../../_interfaces"

type T_REPLACER = string | null

export class TextReplacer {
  private replacePrices(text: string, prices?: FieldDiscountDataRefined): T_REPLACER {
    const textSplited = text.split(' ')
    const fieldsToValidate = ['discountInPercentage', 'discountInValue', 'listPrice', 'sellingPrice'] as Array<keyof FieldDiscountDataRefined>

    const putVarsOnText = textSplited.map((word) => {
      const catchTheVariableOnText = word.match(/\{.*\}/g)?.[0]

      if (!catchTheVariableOnText) {
        return word
      }

      const wordFormatted = catchTheVariableOnText.replace(/[{}]/g, "")
      const wordAttribute = (prices as any)?.[wordFormatted]
      let valueOnObject = null

      if (wordAttribute) {
        if (wordFormatted === 'discountInPercentage') {
          valueOnObject = Math.floor(wordAttribute)
        } else {
          valueOnObject = wordAttribute.toFixed(2)
        }
      }

      if (valueOnObject) {
        return word.replace(/\{.*\}/g, valueOnObject)
      }

      return wordFormatted
    })

    const haveVariableOnText = putVarsOnText.some(word => (fieldsToValidate as any)?.includes(word))

    return haveVariableOnText ? null : putVarsOnText.join(',').replace(/,/g, ' ')
  }

  public replaceVars(text?: string, refinedData?: DataRefined): T_REPLACER {
    if (!text) {
      return null
    }


    return this.replacePrices(text, refinedData?.price)
  }
}
