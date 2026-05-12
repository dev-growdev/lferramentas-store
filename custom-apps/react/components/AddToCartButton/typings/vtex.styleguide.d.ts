declare module 'vtex.styleguide' {
  export const ToastContext: Context
  export const Spinner
  type ToastContextType = {
    showToast: ({
      message,
      duration,
    }: {
      message: string
      duration: number
    }) => unknown
  }
  export const ModalDialog: ModalDialog
  export const Button: Button
}
