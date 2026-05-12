import { FunctionComponent } from 'react'

type GenericObject = Record<string, any>

declare global {
  interface StorefrontFunctionComponent<P = GenericObject>
    extends FunctionComponent<P> {
    getSchema?(props: P): GenericObject
    schema?: GenericObject
  }

  interface StorefrontFC<P = GenericObject> extends FunctionComponent<P> {
    getSchema?(props: P): GenericObject
    schema?: GenericObject
  }

  interface StorefrontComponent<P = GenericObject, S = GenericObject>
    extends Component<P, S> {
    getSchema?(props: P): GenericObject
    schema: GenericObject
  }

  interface Window {
    AddToCart?: (productId: string, quantity: number, sellerId: string) => void
    insider_object?: any;
  }
}
