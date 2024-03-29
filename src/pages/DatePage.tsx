import React from 'react';
import MainLayout from '../layouts/Mainlayout';
import styles from '../styles/pages/DatePage.module.scss';
import { Calendar } from '../components/Calendar';
import { formatDate } from '../utils/helpers/date';
import { State } from '../types/state';
import { Navigate } from '../components/Navigate';
import { formatDateISO } from '../utils/helpers/date/formatDateISO';
import { useStateContext } from '../hooks/useStateContext';

const DatePage = () => {
  const { setState } = useStateContext();
  const [selectedDate, selectDate] = React.useState(new Date());
  const [selectedTime, selectTime] = React.useState('');

  React.useEffect(() => {
    if (selectedDate && selectedTime) {
      const { formattedDateTime } = formatDateISO({
        selectedDate,
        selectedTime,
      });
      setState((prevState) => ({
        ...prevState,
        dateTime: formattedDateTime,
      }));
    }
  }, [selectedDate, selectedTime]);

  return (
    <MainLayout title="Время" subtitle="Выберите удобное вам время" isArrow>
      <div className={styles.container}>
        <div className={styles.date__container}>
          {formatDate(selectedDate, `DDD DD MMM YYYY ${selectedTime}`)}
        </div>
        <Calendar
          locale="ru"
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          selectDate={selectDate}
          selectTime={selectTime}
        />
      </div>
      <Navigate page="Date" />
    </MainLayout>
  );
};

export default DatePage;
