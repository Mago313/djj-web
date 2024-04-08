import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useModal } from '../hooks/useModal';
import { useModalContext } from '../hooks/useModalVisible';
import { useStateContext } from '../hooks/useStateContext';
import styles from '../styles/modal/Modal.module.scss';
import { AppointmentResponse } from '../types/user';

const Modal = () => {
  const { state } = useStateContext();
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
        {data.response?.message || data.response?.appointment?.isActive ? (
          <div>
            <h3
              style={{
                color: !data.response?.appointment?.isActive ? 'red' : 'green',
                textAlign: 'center',
              }}
            >
              {functions.responseMessage(data.response)}
            </h3>
          </div>
        ) : (
          <>
            <Input title={'Введите имя*'} isValid={data.isValidName}>
              <input
                maxLength={13}
                type="text"
                value={state.name}
                onChange={functions.handleNameChange}
              />
            </Input>
            <Input
              title={'Введите номер телефона*'}
              isValid={data.isValidPhone}
            >
              <InputMask
                mask="+7 (999) 999-99-99"
                placeholder="+7 (___) ___-__-__"
                inputMode="numeric"
                value={state.phone}
                onChange={functions.handlePhoneChange}
              />
            </Input>
          </>
        )}

        <Link
          style={{ textDecoration: 'none' }}
          to={
            data?.response?.message === AppointmentResponse.Exist ? '/date' : ''
          }
        >
          <Button
            width={'262px'}
            disabled={data.isDisabled}
            isLoading={data.isPending}
            onClick={functions.onSubmit}
            children={functions.buttonMessage(data.response)}
          />
        </Link>
      </div>
    </div>
  );
};

export default Modal;
