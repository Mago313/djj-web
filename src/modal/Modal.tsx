import React, { useMemo, useCallback, useState, ChangeEvent } from 'react';
import styles from '../styles/modal/Modal.module.scss';
import { State } from '../types/state';
import { Button } from '../components/Button';
import InputMask from 'react-input-mask';
import { Link, useNavigate } from 'react-router-dom';
import { baseService } from '../api/api';
import { useMutation } from 'react-query';

type TProps = {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  setState: React.Dispatch<React.SetStateAction<State>>;
  state: State;
};

const Modal = ({ active, setActive, setState, state }: TProps) => {
  const [isValidName, setIsValidName] = useState<boolean>(false);
  const [isValidPhone, setIsValidPhone] = useState<boolean>(false);
  const [memoizedState, setMemoizedState] = useState<State | null>(null);
  const redirect = useNavigate();

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

  const { mutate, data, isLoading } = useMutation(createAppointment, {});

  useMemo(() => {
    if (active && state.name && state.phone) {
      setMemoizedState(state);
      const nameIsValid = /^[а-яА-Я]+$/u.test(state.name);
      const phoneIsValid = state.phone.toString().length === 11;
      const isNameLengthValid = state.name.length >= 3;
      setIsValidName(nameIsValid && isNameLengthValid);
      setIsValidPhone(phoneIsValid);
    }
  }, [active, state]);

  const isDisabled = !isValidName || !isValidPhone;

  const closeModal = () => {
    setActive(false);
    setState((prevData) => ({
      ...prevData,
      cards: [],
      name: '',
      phone: 7,
      price: 0,
      dateTime: '',
      time: '',
    }));
  };

  return (
    <div
      className={`${styles.modal} ${active ? styles.active : ''}`}
      onClick={closeModal}
    >
      <div
        className={styles.modal__content}
        onClick={(e) => e.stopPropagation()}
      >
        {data?.message || data?.appointment?.isActive ? (
          <div>
            <h3
              style={{
                color: !data?.appointment?.isActive ? 'red' : 'green',
                textAlign: 'center',
              }}
            >
              {data?.appointment?.isActive
                ? 'Вы успешно записались!'
                : data?.message === 'Day off'
                  ? 'Админ приостановил записи'
                  : 'Выбранное время уже занято!'}
            </h3>
          </div>
        ) : (
          <>
            <div
              style={{ border: isValidName ? '1px solid green' : undefined }}
              className={styles.ui__wrapper}
            >
              <div className={styles.input__wrapper}>
                <legend>
                  <label
                    className={isValidName ? styles.valid : styles.erorr}
                    form="phonenumber"
                  >
                    {isValidName ? 'Введите имя*' : 'Введите корректное имя*'}
                  </label>
                </legend>
                <div className={styles.textfield}>
                  <input
                    value={state.name}
                    maxLength={13}
                    type="text"
                    onChange={handleNameChange}
                  />
                </div>
              </div>
            </div>
            <div
              style={{ border: isValidPhone ? '1px solid green' : undefined }}
              className={styles.ui__wrapper}
            >
              <label className={styles.dropdown__container}>🇷🇺</label>
              <div className={styles.input__wrapper}>
                <legend className={isValidPhone ? styles.valid : styles.erorr}>
                  <label form="phonenumber">Введите номер телефона*</label>
                </legend>
                <div className={styles.textfield}>
                  <InputMask
                    mask="+7 (999) 999-99-99"
                    value={state.phone}
                    onChange={handlePhoneChange}
                    placeholder="+7 (___) ___-__-__"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <Link
          style={{ textDecoration: 'none' }}
          to={data?.message === 'Date already exists' ? '/date' : ''}
        >
          <Button
            disabled={isDisabled}
            btnWidth={262}
            isLoading={isLoading}
            onClick={() => {
              if (data?.appointment?.isActive) {
                closeModal();
              } else if (data?.message === 'Date already exists') {
                setActive(false);
                setState((prevData) => ({
                  ...prevData,
                  dateTime: '',
                  time: '',
                }));
              } else if (data?.message === 'Day off') {
                setActive(false);
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
            }}
            title={
              data?.message === 'Date already exists'
                ? 'Выбрать другое время'
                : data?.appointment?.isActive || data?.message === 'Day off'
                  ? 'Закрыть'
                  : 'Записаться'
            }
          />
        </Link>
      </div>
    </div>
  );
};

export default Modal;
