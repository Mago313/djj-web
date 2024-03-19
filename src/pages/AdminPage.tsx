import MainLayout from '../layouts/Mainlayout';
import { baseService } from '../api/api';
import { useMutation, useQuery } from 'react-query';
import styles from '../styles/components/CategoriesCard.module.scss';
import { Appointment } from '../types/category';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { checkIsDayOff, dayOff } from '../store/adminSlise';

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

  return (
    <MainLayout title="Записи" isArrow>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <input
          checked={isDayOff}
          type="checkbox"
          onChange={(e) => handleCheckboxChange(e.target.checked)}
        />
        <p style={{ textAlign: 'center' }}>Приостановить записи</p>
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
              <div
                style={{
                  padding: 4,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p>{item.name}</p>
                  <a className={styles.phone} href={`tel:${item.phone}`}>
                    {item.phone}
                  </a>
                </div>

                <div>
                  {item.cards?.map((card, indx) => (
                    <p
                      style={{
                        fontSize: 16,
                        maxWidth: 150,
                        textAlign: 'center',
                      }}
                      key={indx}
                    >
                      {card}
                    </p>
                  ))}
                </div>
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
