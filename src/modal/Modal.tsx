import React, { ChangeEvent, useState } from 'react';
import styles from '../styles/modal/Modal.module.scss';
import { State } from '../types/state';
import { Button } from '../components/Button';
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';
import { baseService } from '../api/api';

type TProps = {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  setState: React.Dispatch<React.SetStateAction<State>>;
  state: State;
};

const Modal = ({ active, setActive, setState, state }: TProps) => {
  const [isValidName, setIsValidName] = React.useState<boolean>(false);
  const [isValidPhone, setIsValidPhone] = React.useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handlers = {
    closeModal: () => {
      setActive(false);
      setState((prevData) => ({
        ...prevData,
        dateTime: '',
        time: '',
      }));
    },
    handlePhoneChange: (event: ChangeEvent<HTMLInputElement>) => {
      const sanitizedValue = event.target.value.replace(/\D/g, '');
      setState((prevState) => ({
        ...prevState,
        phone: Number(sanitizedValue),
      }));
      if (sanitizedValue.length === 11) {
        setIsValidPhone(true);
      } else {
        setIsValidPhone(false);
      }
    },
    handleNameChange: (event: ChangeEvent<HTMLInputElement>) => {
      const name = event.target.value;
      const isValidName = /^[а-яА-Я]+$/u.test(name);
      if (isValidName) {
        setState((prevState) => ({
          ...prevState,
          name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
        }));
        setIsValidName(true);
      } else {
        setState((prevState) => ({ ...prevState, name }));
        setIsValidName(false);
      }
    },
  };

  const actions = {
    onSubmit: async () => {
      const { data } = await baseService.post('/appointments/create', {
        cards: state.cards,
        price: state.price,
        phone: Number(state.phone),
        dateTime: state.dateTime,
        name: state.name,
      });
      if (data.message) {
        setIsError(true);
      } else {
        setActive(false);
        setIsError(false);
        setState((prevData) => ({
          ...prevData,
          phone: 7,
          name: '',
          cards: [],
          dateTime: '',
          price: 0,
          time: '',
        }));
      }
    },
  };

  const isDisabled = !isValidName || !isValidPhone;

  return (
    <div
      className={
        active ? `${styles.modal} ${styles.active}` : `${styles.modal}`
      }
      onClick={() => {
        setActive(false);
        setState((prevData) => ({ ...prevData, phone: +7, name: '' }));
      }}
    >
      <div
        className={styles.modal__content}
        onClick={(e) => e.stopPropagation()}
      >
        {isError ? (
          <div>
            <h3 style={{ color: 'red', textAlign: 'center' }}>
              Выбранное время уже занято!
            </h3>{' '}
            <br />
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
                    onChange={handlers.handleNameChange}
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
                    onChange={handlers.handlePhoneChange}
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <Link style={{ textDecoration: 'none' }} to={isError ? '/date' : '/'}>
          <Button
            disabled={isDisabled}
            onClick={isError ? handlers.closeModal : actions.onSubmit}
            title={isError ? 'Выбрать другое время' : 'Записаться'}
          />
        </Link>
      </div>
    </div>
  );
};

export default Modal;
