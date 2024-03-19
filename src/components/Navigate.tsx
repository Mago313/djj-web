import { SetStateAction } from 'react';
import { State } from '../types/state';
import Modal from '../modal/Modal';
import { Link } from 'react-router-dom';
import { Button } from './Button';

type TProps = {
  page: 'Date' | 'Categories';
  state: State;
  modalActive: boolean;
  setModalActive: React.Dispatch<SetStateAction<boolean>>;
  setState: React.Dispatch<SetStateAction<State>>;
};

export const Navigate = ({
  page,
  modalActive,
  state,
  setModalActive,
  setState,
}: TProps) => {
  if (
    page === 'Date'
      ? state.dateTime
      : page === 'Categories' && state.cards?.length
  ) {
    return (
      <div>
        {
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
              title={
                state.cards?.length && state.dateTime
                  ? 'Продолжить'
                  : state.cards?.length || state.dateTime
                    ? 'Далее'
                    : ''
              }
              onClick={() => {
                if (state.price && state.dateTime) {
                  setModalActive(!modalActive);
                }
              }}
            />
          </Link>
        }
        {state.dateTime && state.cards?.length !== 0 && modalActive && (
          <Modal
            active={modalActive}
            setActive={setModalActive}
            state={state}
            setState={setState}
          />
        )}
      </div>
    );
  } else {
    return null;
  }
};
