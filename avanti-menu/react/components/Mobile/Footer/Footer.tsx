import React from "react"
import { FooterContainer } from "./FooterContainer"
import { ItemsContainer } from "./Items/ItemsContainer"
import { Items } from "./Items/Items"

export const Footer = () => {
  
  return (
    <FooterContainer>
      <ItemsContainer>
        <Items />
      </ItemsContainer>
    </FooterContainer>
  )
}
