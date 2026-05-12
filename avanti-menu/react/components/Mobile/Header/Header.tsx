import React from "react"
import { HeaderContainer } from "./HeaderContainer"
import { ItemsContainer } from "./Items/ItemsContainer"
import { TitleContainer } from "./Title/TitleContainer"
import { Title } from "./Title/Title"
import { CloseButton } from "./Title/CloseButton"
import { Items } from "./Items/Items"
import { ButtonsContainer } from "./Title/ButtonsContainer"
import { LogoutButton } from "./Title/LogoutButton"

export const Header = () => {
  return (
    <HeaderContainer>
      <TitleContainer>
        <Title />
        <ButtonsContainer>
          <LogoutButton />
          <CloseButton />
        </ButtonsContainer>
      </TitleContainer>
      <ItemsContainer>
        <Items />
      </ItemsContainer>
    </HeaderContainer>
  )
}
