import ReactSwitch from 'react-switch';
import arrow from '../assets/arrow.svg';
import loading from '../assets/black-loading.svg';
import { Loading } from '../components/Loading';
import { useAdmin } from '../hooks/useAdmin';
import MainLayout from '../layouts/Mainlayout';
import styles from '../styles/components/CategoriesCard.module.scss';
import { Appointment } from '../types/category';
import { Spacing } from '../utils/helpers/Spacing';
import PhoneNumber from '../utils/helpers/formatPhone';

export const formatter = new Intl.DateTimeFormat('ru', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZone: 'UTC',
});

const AdminPage = () => {
  const { state, functions } = useAdmin();

  return (
    <MainLayout title="Записи" subtitle="Приостановить записи" isArrow>
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
          boxShadow="0px 1px 1px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 3px rgba(0, 0, 0, 0.2)"
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
        }}
      >
        {state.isLoading ? (
          <Spacing
            paddingTop="30px"
            children={<Loading src={loading} height={50} width={50} />}
          />
        ) : (
          state.appointments
            ?.sort(
              (a: Appointment, b: Appointment) =>
                new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
            )
            .map((item: Appointment, index: number) => (
              <div key={index} className={styles.appointment}>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px',
                    }}
                  >
                    <div>
                      <p style={{ marginTop: 8 }}>{item.name}</p>
                      <PhoneNumber phoneNumber={item.phone} />
                    </div>

                    <div>
                      <img
                        src={arrow}
                        alt=""
                        onClick={() => functions.toggleOpen(item._id)}
                        width={21}
                        height={21}
                        style={{
                          transform:
                            state.openCardId === item._id
                              ? 'rotate(90deg)'
                              : 'rotate(270deg)',
                          transition: 'transform 0.4s',
                        }}
                      />
                    </div>
                  </div>

                  {state.isOpen && (
                    <div
                      className={`${styles.hide__container} ${state.isOpen ? styles.open : undefined}`}
                    >
                      {item.cards?.map((card, indx) => (
                        <div
                          className={`${styles.hide} ${state.openCardId === item._id ? styles.open : undefined}`}
                          key={indx}
                        >
                          {state.openCardId === item._id && (
                            <p
                              style={{
                                textAlign: 'center',
                              }}
                            >
                              {card}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.timeBar}>
                  <span>{formatter.format(new Date(item.dateTime))}</span>
                  <div>{item.price} ₽</div>
                  <input
                    type="checkbox"
                    onClick={() => {
                      functions.deleteAppointment({
                        id: item._id,
                        isActive: false,
                      });
                    }}
                  />
                </div>
              </div>
            ))
        )}
      </div>
    </MainLayout>
  );
};

export default AdminPage;
