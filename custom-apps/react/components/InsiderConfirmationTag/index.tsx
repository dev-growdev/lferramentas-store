import { useEffect } from 'react'

const InsiderConfirmationTag: StorefrontFunctionComponent = () => {
  useEffect(() => {
    const removeInsiderProperties = () => {
      if (!window.insider_object || typeof window.insider_object !== 'object')
        return

      const propsToRemove = ['transaction', 'page']

      propsToRemove.forEach(prop => {
        if (window.insider_object.hasOwnProperty(prop)) {
          delete window.insider_object[prop]
        }
      })
    }

    const handleBeforeUnload = () => {
      removeInsiderProperties()
    }

    const handleRequests = () => {
      try {
        const ajaxListenerConfirmation = function (
          callback: (url: string, response: any, method: string) => void
        ): void {
          'use strict'

          const oldOpen: (
            method: string,
            url: string,
            async?: boolean,
            user?: string | null,
            password?: string | null
          ) => void = XMLHttpRequest.prototype.open

          XMLHttpRequest.prototype.open = function (
            method: string,
            url: string
          ): void {
            this.addEventListener('readystatechange', function (
              this: XMLHttpRequest
            ) {
              if (
                this.responseType !== 'arraybuffer' &&
                this.responseType !== 'blob' &&
                this.readyState === 4 &&
                this.status === 200 &&
                typeof callback === 'function'
              ) {
                callback(url, this.response, method)
              }
            })

            oldOpen.apply(this, arguments as any)
          }
        }

        ajaxListenerConfirmation(function (url, _, method) {
          if (
            method.toLowerCase() === 'post' &&
            url.indexOf('/hit') > -1 &&
            window.insider_object.page.type === 'Confirmation'
          ) {
            window.insider_object = {
              page: {
                type: 'Other',
              },
            }
          }
        })
      } catch (error) {
        console.error('Erro no handleRequests:', error)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    handleRequests()

    return () => {
      removeInsiderProperties()
      window.removeEventListener('beforeunload', handleBeforeUnload)
      XMLHttpRequest.prototype.open = XMLHttpRequest.prototype.open
    }
  }, [])

  return null
}

export default InsiderConfirmationTag
