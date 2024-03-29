import React, { ReactNode, createContext, useContext, useState } from 'react';

const ModalContext = createContext<
  | {
      modalVisible: boolean;
      setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <ModalContext.Provider value={{ modalVisible, setModalVisible }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};
