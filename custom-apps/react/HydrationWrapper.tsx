import React from 'react'


const HydrationWrapper = ({ children }: any) => {
  return <>{React.Children.map(children, (child) => {
    return (child)
  })}</>
}

export default HydrationWrapper;
