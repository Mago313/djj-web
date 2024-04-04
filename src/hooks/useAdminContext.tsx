import React, { ReactNode, createContext, useContext, useState } from 'react';
import { IUser } from '../types/user';

const AdminContext = createContext<
  | {
      admin: IUser;
      setAdmin: React.Dispatch<React.SetStateAction<IUser>>;
    }
  | undefined
>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<IUser>({
    data: { user: { isAdmin: false, isDayOff: false, login: '', name: '' } },
  });

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminContext must be used within a AdminProvider');
  }
  return context;
};
