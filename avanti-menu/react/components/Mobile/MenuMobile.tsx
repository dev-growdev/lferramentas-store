import React from 'react'
import { ChangeTheme } from './ChangeTheme'
import { Hamburguer } from './Hamburguer'
import { Container } from './Container'
import { Overlay } from './Overlay'
import { Header } from './Header/Header'
import { MenuItems } from './Menu/MenuItems'
import { Footer } from './Footer/Footer'

export const MenuMobile = () => {

  return (
    <ChangeTheme>
      <Hamburguer />
      <Overlay />
      <Container>
        <Header />
        <MenuItems />
        <Footer />
      </Container>
    </ChangeTheme>
  )
}