import { ProdCtx } from '../typings/types'

const getSelectedItem = (ctx: ProdCtx) => {
  return ctx?.selectedItem || undefined
}

export default getSelectedItem
