import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { User } from '../shared/interfaces/structs.interfaces';

type Store = {
  user?: User;
};

type SetStore = Dispatch<SetStateAction<Store>>;

const AppContext = createContext<{ store: Store; setStore: SetStore }>({
  store: {},
  setStore: null,
});

const AppContextProvider = ({ children }: { children: ReactNode[] }) => {
  const [store, setStore] = useState({});

  return <AppContext.Provider value={{ store, setStore }}>{...children}</AppContext.Provider>;
};

export { AppContext, AppContextProvider };
