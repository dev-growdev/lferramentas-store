import React, { useState } from 'react';
import { getLocalStorage, setLocalStorage } from './components/Utils/LocalStorage';
import { AvantiMenuContext } from './context/AvantiMenuContext';
import { messages } from './messages';
import { AvantiMenuChildrenProps, AvantiMenuContextProps, CategoriesMenu } from './typings/types';

import GET_MENU_DATA from './graphql/menu.graphql'
import { useQuery } from 'react-apollo'

const AvantiMenuProvider = ({ items, children }: AvantiMenuContextProps & AvantiMenuChildrenProps) => {
  const [categories, setCategories] = useState<CategoriesMenu[]>([]);

  useQuery(GET_MENU_DATA, {
    ssr: true,
    fetchPolicy: 'cache-first',
    onCompleted: data => {

      (async () => {
        const storageKey = 'avanti-menu'
        const getItem = getLocalStorage(storageKey)

        if (getItem) {
          setCategories(getItem)
          return
        }

        setCategories(data.categories)
        setLocalStorage(storageKey, data.categories as any, 20)
      })()
    },
    onError: error => {
      console.log(error);
    }
  })

  return <AvantiMenuContext.Provider value={{ items, categories }}>{children}</AvantiMenuContext.Provider>;
};

AvantiMenuProvider.schema = {
  title: messages.menuParentTitle.id,
};

export default AvantiMenuProvider;
