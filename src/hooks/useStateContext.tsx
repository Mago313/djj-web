import React, { ReactNode, createContext, useContext, useState } from 'react';
import { State } from '../types/state';

const StateContext = createContext<
  | { state: State; setState: React.Dispatch<React.SetStateAction<State>> }
  | undefined
>(undefined);

export const initialState = {
  name: '',
  cards: [],
  dateTime: '',
  phone: 7,
  price: 0,
};

export const StateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<State>(initialState);

  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  return context;
};
