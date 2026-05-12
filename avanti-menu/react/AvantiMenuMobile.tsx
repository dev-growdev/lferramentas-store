import React, { useState, useEffect } from 'react';
import { MenuMobile } from './components/Mobile/MenuMobile';
import { AvantiMenuMobileContext } from './context/AvantiMenuContext';
import { messages } from './messages';
import type { AvantiMenuMobileContextProps } from './typings/types';

export const AvantiMenuMobile = (props: AvantiMenuMobileContextProps) => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    // remove body scroll when menu is open
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [open])

  return (
    <AvantiMenuMobileContext.Provider value={{ props, open, setOpen }}>
      <MenuMobile />
    </AvantiMenuMobileContext.Provider>
  );
};

AvantiMenuMobile.schema = {
  title: messages.avantiMenuItemsTitleMobile.id,
};

export default AvantiMenuMobile;
