import React from 'react'

interface Props {
    children: React.ReactNode
}

export const SimilarProductsVariantsHelper = ({ children }: Props) => {

    const stopBubblingUp: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }


    return (
        <div onClick={stopBubblingUp}>
            {children}
        </div>)
}