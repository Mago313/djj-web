import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { accessToken, baseService, refreshToken } from '../api/api';
import { useAdminContext } from './useAdminContext';
import { useCheckIsAdmin } from './useCheckIsAdmin';

export interface IShippingFields {
  login: string;
  password: string;
}

const useAuthorization = () => {
  useCheckIsAdmin();
  const { register, handleSubmit, watch } = useForm<IShippingFields>();
  const { login, password } = watch();
  const {
    admin: {
      data: { user },
    },
    setAdmin,
  } = useAdminContext();
  const {
    data: response,
    mutate,
    isPending,
  } = useMutation<any, AxiosError, FieldValues>({
    mutationFn: (data) => {
      return baseService.post('/auth/login/', data);
    },
  });

  const redirect = useNavigate();

  React.useEffect(() => {
    if (response) {
      const { isAdmin, isDayOff, login, name } = response.data.user;
      setAdmin((prevAdmin) => ({
        ...prevAdmin,
        data: { user: { isAdmin, isDayOff, login, name } },
      }));
      accessToken(response.data.accessToken);
      refreshToken(response.data.refreshToken);
    }
  }, [response]);

  React.useEffect(() => {
    user.isAdmin && redirect('/admin');
  }, [user.isAdmin]);

  const onSubmit: SubmitHandler<IShippingFields> = (data: IShippingFields) => {
    mutate(data);
  };

  const isDisabled = login?.length === 0 || password?.length === 0;

  return {
    state: {
      login,
      password,
      isPending,
      isDisabled,
    },
    functions: {
      register,
      onSubmit,
      redirect,
      handleSubmit,
    },
  };
};

export default useAuthorization;
