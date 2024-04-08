import { Link } from 'react-router-dom';
import Modal from 'src/modal/Modal';
import { useModalContext } from '../hooks/useModalVisible';
import { useStateContext } from '../hooks/useStateContext';
import { Button } from './Button';

type TProps = {
  title: string;
};

export const Navigate = ({ title }: TProps) => {
  const { state } = useStateContext();
  const { modalVisible, setModalVisible } = useModalContext();

  return (
    <div>
      <Link
        style={{ textDecoration: 'none' }}
        to={
          state.dateTime && state.price
            ? ''
            : state.dateTime
              ? '/categories'
              : '/date'
        }
      >
        <Button
          children={state.price && state.dateTime ? 'Продолжить' : title}
          isLoading={false}
          onClick={() => {
            if (state.price && state.dateTime) {
              setModalVisible(!modalVisible);
            }
          }}
        />
      </Link>
      {modalVisible && <Modal />}
    </div>
  );
};
