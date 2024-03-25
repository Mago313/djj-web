import MainLayout from '../layouts/Mainlayout';
import { baseService } from '../api/api';
import { useMutation, useQuery } from 'react-query';
import styles from '../styles/components/CategoriesCard.module.scss';
import { Appointment } from '../types/category';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { dayOff } from '../store/adminSlise';
import PhoneNumber from '../utils/helpers/formatPhone';
import arrow from '../assets/arrow.svg';

const formatter = new Intl.DateTimeFormat('ru', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZone: 'UTC',
});

async function fetchAppointments() {
  const { data } = await baseService.get('/appointments/get');

  return data;
}

const AdminPage = () => {
  const [isOpen, setIsOpen] = useState<string>('');
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const { isDayOff } = useAppSelector((state) => state.adminSlice);
  const dispatch = useAppDispatch();

  const { data: appointments } = useQuery('appointments', fetchAppointments);

  const mutation = useMutation(
    ({ id, isActive }: { id: string; isActive: boolean }) => {
      return baseService.patch(`/appointments/status/${id}`, isActive);
    }
  );
  const handleCheckboxChange = (isDayOff: boolean) => {
    dispatch(dayOff(isDayOff));
  };

  const toggleOpen = (cardId: string) => {
    setOpenCardId(openCardId === cardId ? null : cardId);
    if (openCardId !== cardId) {
      setIsOpen(cardId);
    }
  };

  return (
    <MainLayout title="Записи" subtitle="Приостановить записи" isArrow>
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <input
          checked={isDayOff}
          type="checkbox"
          onChange={(e) => handleCheckboxChange(e.target.checked)}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {appointments
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
                      onClick={() => toggleOpen(item._id)}
                      width={21}
                      height={21}
                      style={{
                        transform:
                          openCardId === item._id
                            ? 'rotate(90deg)'
                            : 'rotate(270deg)',
                        transition: 'transform 0.4s',
                      }}
                    />
                  </div>
                </div>

                {isOpen && (
                  <div
                    className={`${styles.hide__container} ${isOpen ? styles.open : undefined}`}
                  >
                    {item.cards?.map((card, indx) => (
                      <div
                        className={`${styles.hide} ${openCardId === item._id ? styles.open : undefined}`}
                        key={indx}
                      >
                        {openCardId === item._id && (
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
                    mutation.mutate({ id: item._id, isActive: false });
                  }}
                />
              </div>
            </div>
          ))}
      </div>
    </MainLayout>
  );
};

export default AdminPage;
