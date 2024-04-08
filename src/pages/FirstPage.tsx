import { useQuery } from '@tanstack/react-query';
import services from '../assets/checkMark.png';
import date from '../assets/date.svg';
import { Button } from '../components/Button';
import MenuBlock from '../components/MenuBlock';
import { fetchCheckIsDayOff } from '../hooks/useAdmin';
import { useModalContext } from '../hooks/useModalVisible';
import { useStateContext } from '../hooks/useStateContext';
import MainLayout from '../layouts/MainLayout';
import Modal from '../modal/Modal';
import { Spacing } from '../utils/helpers/Spacing';
import LoaderPage from './LoaderPage';

const FirstPage = () => {
  const { state } = useStateContext();
  const { modalVisible, setModalVisible } = useModalContext();
  const { data, isLoading } = useQuery({
    queryKey: ['dayOff'],
    queryFn: fetchCheckIsDayOff,
  });

  if (isLoading) return <LoaderPage />;

  if (data.isDayOff) {
    return (
      <MainLayout
        title="DJJ"
        subtitle="Уход за мужским имиджем"
        children={
          <Spacing
            paddingTop="150px"
            children={<h4>Админ временно приостановил записи</h4>}
          />
        }
      />
    );
  }

  return (
    <MainLayout title="DJJ" subtitle="Уход за мужским имиджем">
      <Spacing children={<MenuBlock img={date} name="Время" link="/date" />} />
      <Spacing
        children={<MenuBlock img={services} name="Услуги" link="/categories" />}
      />
      {modalVisible || (
        <Spacing
          children={
            state.price && state.dateTime ? (
              <Button
                children={'Продолжить'}
                isLoading={false}
                onClick={() => {
                  setModalVisible(!modalVisible);
                }}
              />
            ) : (
              <></>
            )
          }
        />
      )}
      {modalVisible && <Modal />}
    </MainLayout>
  );
};

export default FirstPage;
