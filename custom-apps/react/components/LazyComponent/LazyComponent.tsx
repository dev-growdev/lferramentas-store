import React from 'react'
import ContentLoader from "react-content-loader"

interface IProps {
  width: number,
  height: number
}

const LazyComponent = ({ width, height }: IProps) => (
  <ContentLoader
    speed={2}
    width={width}
    height={height}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="15" y="15" width={width} height={height} />
  </ContentLoader>
)
export default LazyComponent
