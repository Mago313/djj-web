import { ChangeEvent, useMemo, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { baseService } from '../api/api';
import { State } from '../types/state';
import { AppointmentResponse } from '../types/user';
import { useModalContext } from './useModalVisible';
import { initialState, useStateContext } from './useStateContext';

export const useModal = () => {
  const queryClient = useQueryClient();
  const { state, setState } = useStateContext();
  const [memoizedState, setMemoizedState] = useState<State | null>(null);
  const { modalVisible, setModalVisible } = useModalContext();
  const [isValidName, setIsValidName] = useState<boolean>(false);
  const [isValidPhone, setIsValidPhone] = useState<boolean>(false);

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = event.target.value.replace(/\D/g, '');
    setState((prevState) => ({
      ...prevState,
      phone: Number(sanitizedValue),
    }));
    setIsValidPhone(sanitizedValue.length === 11);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    const formattedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    setState((prevState) => ({
      ...prevState,
      name: formattedName,
    }));
    setIsValidName(/^[а-яА-Я]{3,}$/u.test(name));
  };

  const createAppointment = async (data: State) => {
    const { data: responseData } = await baseService.post(
      '/appointments/create',
      data
    );

    return responseData;
  };
  const {
    mutate,
    data: response,
    isPending,
  } = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  useMemo(() => {
    if (modalVisible && state.name && state.phone) {
      setMemoizedState(state);
      const nameIsValid = /^[а-яА-Я]+$/u.test(state.name);
      const phoneIsValid = state.phone.toString().length === 11;
      const isNameLengthValid = state.name.length >= 3;
      setIsValidName(nameIsValid && isNameLengthValid);
      setIsValidPhone(phoneIsValid);
    }
  }, [modalVisible, state]);

  const isDisabled = !isValidName || !isValidPhone;

  const closeModal = () => {
    setModalVisible(false);
    setState(initialState);
    window.location.replace('/');
  };

  const onSubmit = () => {
    switch (true) {
      case response?.appointment?.isActive:
        closeModal();
        break;
      case response?.message === AppointmentResponse.Exist:
        setModalVisible(false);
        setState((prevData) => ({ ...prevData, dateTime: '' }));
        break;
      case response?.message === AppointmentResponse.DayOff:
        setModalVisible(false);
        window.location.replace('/');
        break;
      default:
        mutate(memoizedState ?? state);
        break;
    }
  };

  const buttonMessage = (response: any) => {
    switch (response?.message) {
      case AppointmentResponse.Exist:
        return 'Выбрать другое время';
      case AppointmentResponse.DayOff:
        return 'Закрыть';
      default:
        if (response?.appointment?.isActive) {
          return 'Закрыть';
        } else {
          return 'Записаться';
        }
    }
  };

  const responseMessage = (response: any) => {
    switch (response?.message) {
      case AppointmentResponse.DayOff:
        return 'Админ приостановил записи';
      case AppointmentResponse.Exist:
        return 'Выбранное время уже занято!';
      default:
        return 'Вы успешно записались!';
    }
  };

  return {
    data: {
      isPending,
      isDisabled,
      response,
      memoizedState,
      isValidName,
      isValidPhone,
    },
    functions: {
      mutate,
      onSubmit,
      closeModal,
      buttonMessage,
      responseMessage,
      handleNameChange,
      handlePhoneChange,
      createAppointment,
    },
  };
};
