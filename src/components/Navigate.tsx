import Modal from '../modal/Modal';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { useStateContext } from '../hooks/useStateContext';
import { useModalContext } from '../hooks/useModalVisible';

type TProps = {
  page: 'Date' | 'Categories';
};

export const Navigate = ({ page }: TProps) => {
  const { state } = useStateContext();
  const { modalVisible, setModalVisible } = useModalContext();
  if (
    page === 'Date'
      ? state.dateTime
      : page === 'Categories' && state.cards?.length
  ) {
    return (
      <div>
        <Link
          style={{ textDecoration: 'none' }}
          to={
            state.dateTime && state.cards?.length !== 0
              ? ''
              : state.dateTime
                ? '/categories'
                : '/date'
          }
        >
          <Button
            children={
              state.cards?.length && state.dateTime
                ? 'Продолжить'
                : state.cards?.length || state.dateTime
                  ? 'Далее'
                  : ''
            }
            isLoading={false}
            onClick={() => {
              if (state.price && state.dateTime) {
                setModalVisible(!modalVisible);
              }
            }}
          />
        </Link>
        {state.dateTime && state.cards?.length !== 0 && modalVisible && (
          <Modal />
        )}
      </div>
    );
  } else {
    return null;
  }
};
