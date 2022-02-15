import React, { createContext, Dispatch, ReactNode, useReducer } from 'react';
import { PresenceState } from '../shared/interfaces/phx-response.types';
import { User } from '../shared/interfaces/structs.interfaces';

type Store = {
  user: User;
  presences: PresenceState;
};

const AppContext = createContext<{ store: Store; storeDispatch: Dispatch<StoreAction> }>({
  store: {} as Store,
  storeDispatch: null!,
});

const AppContextProvider = ({ children }: { children: ReactNode[] }) => {
  const [store, storeDispatch] = useReducer(stateReducer, { user: {} as User, presences: {} });

  return <AppContext.Provider value={{ store, storeDispatch }}>{...children}</AppContext.Provider>;
};

type UserReduce = { type: 'user'; value: User };
type PresencesReduce = { type: 'presences'; value: PresenceState };
type StoreAction = UserReduce | PresencesReduce;

function stateReducer(state: Store, action: StoreAction) {
  switch (action.type) {
    case 'user':
      return { ...state, user: action.value };
    case 'presences':
      return { ...state, presences: action.value };
  }
}

export { AppContext, AppContextProvider };
