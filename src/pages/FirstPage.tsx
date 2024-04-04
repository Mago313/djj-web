import { useQuery } from 'react-query';
import '../App.css';
import services from '../assets/checkMark.png';
import date from '../assets/date.svg';
import { Button } from '../components/Button';
import MenuBlock from '../components/MenuBlock';
import { fetchCheckIsDayOff } from '../hooks/useAdmin';
import { useModalContext } from '../hooks/useModalVisible';
import { useStateContext } from '../hooks/useStateContext';
import MainLayout from '../layouts/Mainlayout';
import Modal from '../modal/Modal';
import { Spacing } from '../utils/helpers/Spacing';
import LoaderPage from './LoaderPage';

const FirstPage = () => {
  const { state } = useStateContext();
  const { modalVisible, setModalVisible } = useModalContext();
  const { data, isLoading } = useQuery('isDayOff', fetchCheckIsDayOff);

  if (isLoading) return <LoaderPage />;

  if (data.isDayOff) {
    return (
      <MainLayout title="DJJ" subtitle="Уход за мужским имиджем">
        <Spacing
          paddingTop="150"
          children={<h4>Админ временно приостановил записи</h4>}
        />
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
                children={'Продолжить'}
                isLoading={false}
                onClick={() => {
                  setModalVisible(!modalVisible);
                }}
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
