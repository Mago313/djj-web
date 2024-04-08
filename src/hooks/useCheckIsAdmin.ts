import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import React from 'react';
import { FieldValues } from 'react-hook-form';
import { accessToken, baseService, refreshToken } from '../api/api';
import { IUser } from '../types/user';
import { useAdminContext } from './useAdminContext';

export const useCheckIsAdmin = () => {
  const refToken = Cookies.get('refreshToken');

  const { setAdmin } = useAdminContext();

  const { mutate } = useMutation<IUser, AxiosError, FieldValues>({
    mutationFn: async (data) => {
      setAdmin((prevAdmin) => ({
        ...prevAdmin,
        isLoading: true,
      }));
      const response = await baseService.post('auth/login/access-token', data);
      setAdmin((prevAdmin) => ({
        ...prevAdmin,
        data: { user: response.data.user },
      }));
      setAdmin((prevAdmin) => ({
        ...prevAdmin,
        isLoading: false,
      }));
      accessToken(response.data.accessToken);
      refreshToken(response.data.refreshToken);
      return response.data;
    },
  });

  React.useEffect(() => {
    if (refToken) {
      mutate({ refreshToken: refToken });
    }
  }, []);

  return {};
};
