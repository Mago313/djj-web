import React from "react";
import MainLayout from "../layouts/Mainlayout";

import styles from '../styles/pages/DatePage.module.scss'
import { Calendar } from "../components/Calendar";
import { formatDate } from "../utils/helpers/date";
import { State } from "../types/state";
import { Navigate } from "../components/Navigate";
import { CheckBox } from "../components/CheckBox";
import { useAppSelector } from "../store/store";

type TProps = {
  state: State
  setState: React.Dispatch<React.SetStateAction<State>>
  modalActive: boolean
  setModalActive: React.Dispatch<React.SetStateAction<boolean>>
}

export type TStatus = {
  workingHours: 'break' | 'atWork' | "dayOff"
  breakTime: {
    start: string | null
    end: string | null
  }
}

const DatePage = ({ state, modalActive, setModalActive, setState }: TProps) => {

  const [status, setStatus] = React.useState<TStatus>({
    workingHours: 'atWork',
    breakTime: {
      start: null,
      end: null
    }
  })

  const { loading, isAdmin, error } = useAppSelector(
    (state) => state.adminSlice
  );

  const [selectedDate, selectDate] = React.useState(new Date());


  React.useLayoutEffect(() => {
    if (selectedDate && state.time) {
      const [hours, minutes] = state.time.split(':');
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(Number(hours));
      selectedDateTime.setMinutes(Number(minutes));

      const year = selectedDateTime.getFullYear();
      const month = String(selectedDateTime.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDateTime.getDate()).padStart(2, '0');
      const hoursFormatted = String(selectedDateTime.getHours()).padStart(2, '0');
      const minutesFormatted = String(selectedDateTime.getMinutes()).padStart(2, '0');

      const formattedDateTime = `${year}-${month}-${day}T${hoursFormatted}:${minutesFormatted}:00.000`;

      setState((prevState) => ({
        ...prevState,
        dateTime: formattedDateTime,
      }));
    }
  }, [selectedDate, state.time])

  const onChange = (label?: 'Выходной' | 'Перерыв' | 'На работе') => {
    if(label === 'Выходной') {
      setStatus(prevStatus => ({...prevStatus, workingHours: 'dayOff', breakTime: {
        start: '',
        end: ''
      }}))
    } else if (label === 'На работе') {
      setStatus(prevStatus => ({...prevStatus, workingHours: 'atWork', breakTime: {
        start: null,
        end: null
      }}))
    } else if (label === 'Перерыв') {
      setStatus(prevStatus => ({...prevStatus, workingHours: 'break', breakTime: {
        start: '',
        end: ''
      }}))
    }
  }
  

  return (
    <MainLayout title="Время" isArrow>
      <div className={styles.container}>
        <div className={styles.date__container}>{formatDate(selectedDate, `DDD DD MMM YYYY ${state.time}`)}</div>
        {status.workingHours === 'break' || status.workingHours === 'dayOff' ? <div className={styles.date__container}>{formatDate(selectedDate, `DDD DD MMM YYYY ${state.time}`)}</div> : <></>}
        <Calendar locale="ru" selectDate={selectDate} selectedDate={selectedDate} state={state} setState={setState} />
      </div>
      <Navigate page="Date" modalActive={modalActive} state={state} setState={setState} setModalActive={setModalActive} />
    </MainLayout>
  );
};

export default DatePage;

