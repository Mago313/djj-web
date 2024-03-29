import React from 'react';
import '../App.css';
import MainLayout from '../layouts/Mainlayout';
import date from '../assets/date.svg';
import services from '../assets/checkMark.png';
import Modal from '../modal/Modal';
import { Button } from '../components/Button';
import { State } from '../types/state';
import { Spacing } from '../utils/helpers/Spacing';
import MenuBlock from '../components/MenuBlock';
import { useStateContext } from '../hooks/useStateContext';
import { useModalContext } from '../hooks/useModalVisible';

type TProps = {
  isDayOff: boolean;
};

const FirstPage = ({ isDayOff }: TProps) => {
  const { state } = useStateContext();
  const { modalVisible, setModalVisible } = useModalContext();
  if (isDayOff) {
    return (
      <MainLayout title="DJJ" subtitle="Уход за мужским имиджем">
        <Spacing>
          <h4 style={{ paddingTop: 150 }}>
            Админ временно приостановил записи
          </h4>
        </Spacing>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="DJJ" subtitle="Уход за мужским имиджем">
      <div style={{ paddingTop: 8 }}>
        <Spacing>
          <MenuBlock img={date} name="Время" link="/date" />
        </Spacing>
        <Spacing>
          <MenuBlock img={services} name="Услуги" link="/categories" />
        </Spacing>
        {modalVisible || (
          <Spacing>
            {state.price && state.dateTime ? (
              <Button
                isLoading={false}
                onClick={() => {
                  setModalVisible(!modalVisible);
                }}
                title="Продолжить"
              />
            ) : (
              <></>
            )}
          </Spacing>
        )}
        {modalVisible && <Modal />}
      </div>
    </MainLayout>
  );
};

export default FirstPage;
