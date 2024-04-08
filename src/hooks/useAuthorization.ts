import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { accessToken, baseService, refreshToken } from '../api/api';
import { useAdminContext } from './useAdminContext';

export interface IShippingFields {
  login: string;
  password: string;
}

const useAuthorization = () => {
  const { register, handleSubmit, watch } = useForm();
  const { admin, setAdmin } = useAdminContext();
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

  const { login, password } = watch();

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

  admin.data.user.isAdmin && redirect('/admin', { replace: true });

  const onSubmit: SubmitHandler<FieldValues> = (data: FieldValues) => {
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
