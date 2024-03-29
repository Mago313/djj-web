import React from 'react';
import styles from '../styles/modal/Modal.module.scss';
import { Button } from '../components/Button';
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useStateContext } from '../hooks/useStateContext';
import { useModal } from '../hooks/useModal';
import { useModalContext } from '../hooks/useModalVisible';

const Modal = () => {
  const { state, setState } = useStateContext();
  const { modalVisible } = useModalContext();
  const { data, functions } = useModal();

  return (
    <div
      className={`${styles.modal} ${modalVisible ? styles.active : ''}`}
      onClick={functions.closeModal}
    >
      <div
        className={styles.modal__content}
        onClick={(e) => e.stopPropagation()}
      >
        {data.appResponse?.message ||
        data.appResponse?.appointment?.isActive ? (
          <div>
            <h3
              style={{
                color: !data.appResponse?.appointment?.isActive
                  ? 'red'
                  : 'green',
                textAlign: 'center',
              }}
            >
              {data.appResponse?.appointment?.isActive
                ? 'Вы успешно записались!'
                : data.appResponse?.message === 'Day off'
                  ? 'Админ приостановил записи'
                  : 'Выбранное время уже занято!'}
            </h3>
          </div>
        ) : (
          <>
            <div
              style={{
                border: data.isValidName ? '1px solid green' : undefined,
              }}
              className={styles.ui__wrapper}
            >
              <div className={styles.input__wrapper}>
                <legend>
                  <label
                    className={data.isValidName ? styles.valid : styles.erorr}
                    form="phonenumber"
                  >
                    {data.isValidName
                      ? 'Введите имя*'
                      : 'Введите корректное имя*'}
                  </label>
                </legend>
                <div className={styles.textfield}>
                  <input
                    value={state.name}
                    maxLength={13}
                    type="text"
                    onChange={functions.handleNameChange}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                border: data.isValidPhone ? '1px solid green' : undefined,
              }}
              className={styles.ui__wrapper}
            >
              <label className={styles.dropdown__container}>🇷🇺</label>
              <div className={styles.input__wrapper}>
                <legend
                  className={data.isValidPhone ? styles.valid : styles.erorr}
                >
                  <label form="phonenumber">Введите номер телефона*</label>
                </legend>
                <div className={styles.textfield}>
                  <InputMask
                    mask="+7 (999) 999-99-99"
                    value={state.phone}
                    onChange={functions.handlePhoneChange}
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
          to={
            data?.appResponse?.message === 'Date already exists' ? '/date' : ''
          }
        >
          <Button
            disabled={data.isDisabled}
            btnWidth={262}
            isLoading={data.isLoading}
            onClick={functions.onSubmit}
            title={
              data.appResponse?.message === 'Date already exists'
                ? 'Выбрать другое время'
                : data.appResponse?.appointment?.isActive ||
                    data.appResponse?.message === 'Day off'
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
