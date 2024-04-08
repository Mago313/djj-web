import ReactSwitch from 'react-switch';
import loading from '../assets/black-loading.svg';
import { Loading } from '../components/Loading';
import { useAdmin } from '../hooks/useAdmin';
import MainLayout from '../layouts/MainLayout';
import { Appointment } from '../types/category';
import { Spacing } from '../utils/helpers/Spacing';

const AdminPage = () => {
  const { state, functions } = useAdmin();

  return (
    <MainLayout title="Записи" subtitle="Приостановить записи" isArrow isAdmin>
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <ReactSwitch
          onColor="#93b1ff"
          onHandleColor="#93b1ff"
          handleDiameter={30}
          uncheckedIcon={true}
          checkedIcon={true}
          boxShadow="1px 1px 1px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="1px 1px 1px 1px rgba(0, 0, 0, 0.4)"
          height={20}
          width={48}
          onChange={functions.handleSwitch}
          checked={state.user.isDayOff}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'scroll',
          height: '700px',
        }}
        onScroll={functions.handleScroll}
      >
        {state.isLoading ? (
          <Spacing
            paddingTop="30px"
            children={<Loading src={loading} height={50} width={50} />}
          />
        ) : (
          state.appointments?.map((item: Appointment, index: number) =>
            functions.renderItem({ item, index })
          )
        )}
      </div>
      {state.isRefetching && (
        <Spacing children={<Loading src={loading} height={50} width={50} />} />
      )}
    </MainLayout>
  );
};

export default AdminPage;
