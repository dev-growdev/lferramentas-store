/* eslint-disable @typescript-eslint/ban-types */

interface StorefrontFunctionComponent<P = {}>
  extends React.FunctionComponent<P> {
  getSchema?(props: P): object
  schema?: object
}

interface StorefrontComponent<P = {}, S = {}> extends React.Component<P, S> {
  getSchema?(props: P): object
  schema: object
}
