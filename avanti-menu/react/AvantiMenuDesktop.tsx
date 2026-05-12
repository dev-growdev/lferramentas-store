import React, { useState } from 'react';
import { MenuDesktop } from './components/Desktop/MenuDesktop';
import { AvantiMenuDesktopContext } from './context/AvantiMenuContext';
import { messages } from './messages';
import type { AvantiMenuDesktopContextProps } from './typings/types';

export const AvantiMenuDesktop = (props: AvantiMenuDesktopContextProps) => {
  const [disabledScroll, setDisabledScroll] = useState<boolean>(false);

  return (
    <AvantiMenuDesktopContext.Provider value={{ props, disabledScroll, setDisabledScroll }}>
      <MenuDesktop />
    </AvantiMenuDesktopContext.Provider>
  );
};

AvantiMenuDesktop.schema = {
  title: messages.avantiMenuItemsTitleDesktop.id,
};

export default AvantiMenuDesktop;
