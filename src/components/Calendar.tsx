import React from 'react';
import arrow from '../assets/arrow.svg';
import loading from '../assets/black-loading.svg';
import { useCalendar } from '../hooks/useCalendar';
import styles from '../styles/components/Calendar.module.scss';
import { Spacing } from '../utils/helpers/Spacing';
import { checkDateIsEqual, checkIsToday } from '../utils/helpers/date';
import { Loading } from './Loading';

interface CalendarProps {
  locale?: string;
  selectedTime: string;
  selectedDate: Date;
  selectDate: (date: Date) => void;
  firstWeekDayNumber?: number;
  selectTime: React.Dispatch<React.SetStateAction<string>>;
}

export const Calendar: React.FC<CalendarProps> = ({
  locale = 'default',
  selectedDate: date,
  selectedTime,
  selectDate,
  selectTime,
  firstWeekDayNumber = 2,
}) => {
  const { functions, state } = useCalendar({
    locale,
    selectedDate: date,
    firstWeekDayNumber,
  });

  return (
    <div>
      <div className={styles.calendar}>
        <div className={styles.calendar__header}>
          <div
            aria-hidden
            className={styles.calendar__header__arrow__left}
            onClick={() => functions.onClickArrow('left')}
          />
          {state.mode === 'days' && (
            <div aria-hidden>
              {state.monthesNames[state.selectedMonth.monthIndex].month}{' '}
              {state.selectedYear}
            </div>
          )}
          <div
            aria-hidden
            className={styles.calendar__header__arrow__right}
            onClick={() => functions.onClickArrow('right')}
          />
        </div>
        <div className={styles.calendar__body}>
          {state.mode === 'days' && (
            <>
              <div className={styles.calendar__week__names}>
                {state.weekDaysNames.map((weekDaysName) => (
                  <div key={weekDaysName.dayShort}>{weekDaysName.dayShort}</div>
                ))}
              </div>
              <div className={styles.calendar__days}>
                {state.calendarDays.map((day) => {
                  const currentDay = new Date();
                  const isToday = checkIsToday(day.date);
                  const isSelectedDay = checkDateIsEqual(
                    day.date,
                    state.selectedDay.date
                  );
                  const isAdditionalDay =
                    day.monthIndex !== state.selectedMonth.monthIndex;

                  return (
                    <div
                      key={`${day.dayNumber}-${day.monthIndex}`}
                      aria-hidden
                      onClick={() => {
                        if (isToday || day.date > currentDay) {
                          functions.setSelectedDay(day);
                          selectDate(day.date);
                        }
                      }}
                      style={
                        isToday
                          ? {}
                          : day.date >= currentDay
                            ? {}
                            : { opacity: 0.5 }
                      }
                      className={[
                        styles.calendar__day,
                        day.date >= currentDay ? styles.calendar__day_pick : '',
                        isToday ? styles.calendar__today__item : '',
                        isSelectedDay ? styles.calendar__selected__item : '',
                        isAdditionalDay ? styles.calendar__additional__day : '',
                      ].join(' ')}
                    >
                      {day.dayNumber}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      {state.isLoading ? (
        <Spacing
          paddingTop="50px"
          children={<Loading src={loading} width={50} height={50} />}
        />
      ) : (
        state.filteredTimeIntervals.map((item, index) => {
          return (
            <div className={styles.timeContainer} key={index}>
              <div
                onClick={() => functions.toggleOpen(item.title)}
                className={styles.timeTitle}
              >
                <div className={styles.empty}></div>
                <p>{item.title}</p>
                <img
                  src={arrow}
                  alt=""
                  width={21}
                  height={21}
                  style={{
                    transform: state.isOpen.includes(item.title)
                      ? 'rotate(90deg)'
                      : 'rotate(270deg)',
                    transition: 'transform 0.4s',
                  }}
                />
              </div>

              {!state.isOpen.includes(item.title) && (
                <div className={styles.times}>
                  {item.times.map((time, indx) => (
                    <div
                      onClick={() => {
                        selectTime(time);
                      }}
                      key={indx}
                      className={[
                        styles.time,
                        time === selectedTime
                          ? styles.time__selected__item
                          : '',
                      ].join(' ')}
                    >
                      <p>{time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
