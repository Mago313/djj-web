import { ChangeEvent, useMemo, useState } from 'react';
import { State } from '../types/state';
import { useStateContext } from './useStateContext';
import { baseService } from '../api/api';
import { useModalContext } from './useModalVisible';
import { useMutation } from 'react-query';

export const useModal = () => {
  const { state, setState } = useStateContext();

  const { modalVisible, setModalVisible } = useModalContext();
  const [isValidName, setIsValidName] = useState<boolean>(false);
  const [isValidPhone, setIsValidPhone] = useState<boolean>(false);
  const [memoizedState, setMemoizedState] = useState<State | null>(null);

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
    const isValidName = /^[а-яА-Я]+$/u.test(name);
    const isNameLengthValid = name.length >= 3;
    const formattedName =
      isValidName && isNameLengthValid
        ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        : name;
    setState((prevState) => ({
      ...prevState,
      name: formattedName,
    }));
    setIsValidName(isValidName && isNameLengthValid);
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
    data: appResponse,
    isLoading,
  } = useMutation(createAppointment, {});

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
    setState({
      cards: [],
      name: '',
      phone: 7,
      price: 0,
      dateTime: '',
    });
  };

  const onSubmit = () => {
    if (appResponse?.appointment?.isActive) {
      closeModal();
    } else if (appResponse?.message === 'Date already exists') {
      setModalVisible(false);
      setState((prevData) => ({
        ...prevData,
        dateTime: '',
      }));
    } else if (appResponse?.message === 'Day off') {
      setModalVisible(false);
    } else {
      mutate(
        memoizedState ?? {
          cards: state.cards,
          dateTime: state.dateTime,
          name: state.name,
          phone: state.phone,
          price: state.price,
        }
      );
    }
  };

  return {
    data: {
      isLoading,
      isDisabled,
      appResponse,
      isValidName,
      isValidPhone,
      memoizedState,
    },
    functions: {
      mutate,
      onSubmit,
      closeModal,
      handleNameChange,
      createAppointment,
      handlePhoneChange,
    },
  };
};
