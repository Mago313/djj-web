import { useModalContext } from '../hooks/useModalVisible';
import { useStateContext } from '../hooks/useStateContext';
import { Spacing } from '../utils/helpers/Spacing';
import MenuBlock from '../components/MenuBlock';
import { useAppSelector } from '../store/store';
import services from '../assets/checkMark.png';
import MainLayout from '../layouts/Mainlayout';
import { Button } from '../components/Button';
import date from '../assets/date.svg';
import LoaderPage from './LoaderPage';
import Modal from '../modal/Modal';
import '../App.css';

const FirstPage = () => {
  const { state } = useStateContext();
  const { modalVisible, setModalVisible } = useModalContext();
  const { isDayOff, loading } = useAppSelector((state) => state.adminSlice);

  if (loading) return <LoaderPage />;

  if (isDayOff) {
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
