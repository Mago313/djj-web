import React, { useMemo, useCallback, useState, ChangeEvent } from 'react';
import styles from '../styles/modal/Modal.module.scss';
import { State } from '../types/state';
import { Button } from '../components/Button';
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';
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
    const formattedName = isValidName
      ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      : name;
    setState((prevState) => ({
      ...prevState,
      name: formattedName,
    }));
    setIsValidName(isValidName);
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
      setIsValidName(nameIsValid);
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
              {!data?.appointment?.isActive
                ? 'Выбранное время уже занято!'
                : 'Вы успешно записались!'}
            </h3>
          </div>
        ) : (
          <>
            <div className={styles.ui__wrapper}>
              <div className={styles.input__wrapper}>
                <legend>
                  <label
                    className={isValidName ? undefined : styles.erorr}
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
            <div className={styles.ui__wrapper}>
              <label className={styles.dropdown__container}>🇷🇺</label>
              <div className={styles.input__wrapper}>
                <legend>
                  <label form="phonenumber">Введите номер телефона*</label>
                </legend>
                <div className={styles.textfield}>
                  <InputMask
                    mask="+7 (999) 999-99-99"
                    value={state.phone}
                    onChange={handlePhoneChange}
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <Link
          style={{ textDecoration: 'none' }}
          to={data?.message ? '/date' : ''}
        >
          <Button
            disabled={isDisabled}
            btnWidth={262}
            isLoading={isLoading}
            onClick={
              data?.appointment?.isActive
                ? closeModal
                : data?.message
                  ? () => {
                      setActive(false);
                      setState((prevData) => ({
                        ...prevData,
                        dateTime: '',
                        time: '',
                      }));
                    }
                  : () => {
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
            }
            title={
              data?.message
                ? 'Выбрать другое время'
                : data?.appointment?.isActive
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
