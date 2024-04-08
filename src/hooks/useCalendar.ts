import { useQuery } from '@tanstack/react-query';
import { isAfter, parse, set } from 'date-fns';
import React from 'react';
import { baseService } from '../api/api';
import {
  createDate,
  createMonth,
  formatDate,
  getMonthNumberOfDays,
  getMonthesNames,
  getWeekDaysNames,
} from '../utils/helpers/date';

interface UseCalendarParams {
  locale?: string;
  selectedDate: Date;
  firstWeekDayNumber?: number;
}

interface ITimeIntervals {
  title: string;
  times: string[];
}

const DAYS_IN_WEEK = 7;

const getYearsInterval = (year: number) => {
  const startYear = Math.floor(year);
  return [...Array(10)].map((_, index) => startYear + index);
};

async function getTimes() {
  const { data } = await baseService.get('/appointments/date-time');
  return data;
}

export const useCalendar = ({
  locale = 'default',
  selectedDate: date,
  firstWeekDayNumber = 2,
}: UseCalendarParams) => {
  const [isOpen, setIsOpen] = React.useState<string[]>([]);
  const [mode, setMode] = React.useState('days');
  const [selectedDay, setSelectedDay] = React.useState(createDate({ date }));
  const [selectedMonth, setSelectedMonth] = React.useState(
    createMonth({
      date: new Date(selectedDay.year, selectedDay.monthIndex),
      locale,
    })
  );
  const [selectedYear, setSelectedYear] = React.useState(selectedDay.year);
  const [selectedYearsInterval, setSelectedYearsInterval] = React.useState(
    getYearsInterval(selectedDay.year)
  );

  const { data, isLoading } = useQuery({
    queryKey: ['time'],
    queryFn: getTimes,
  });

  const timeIntervals: ITimeIntervals[] = [
    { title: 'Утро', times: ['10:00', '11:00', '12:00'] },
    {
      title: 'День',
      times: ['13:00', '14:00', '15:00'],
    },
    {
      title: 'Вечер',
      times: ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
    },
  ];
  const selectedDateFormatted = formatDate(selectedDay.date, 'YYYY-MM-DD');

  const [filteredTimeIntervals, setFilteredTimeIntervals] = React.useState<
    ITimeIntervals[]
  >([]);

  const [currentDate, setCurrentDate] = React.useState(new Date());

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    const updatedIntervals = timeIntervals
      .map(({ title, times }) => ({
        title,
        times: times.filter((time) => {
          const [hour, minutes] = time.split(':');
          const timeToCheck = set(
            parse(selectedDateFormatted, 'yyyy-MM-dd', new Date()),
            {
              hours: parseInt(hour),
              minutes: parseInt(minutes),
            }
          );

          return (
            isAfter(timeToCheck, currentDate) &&
            !data?.includes(selectedDateFormatted + 'T' + time + ':00.000Z')
          );
        }),
      }))
      .filter((item) => item.times.length >= 1);

    setFilteredTimeIntervals(updatedIntervals);
  }, [selectedDateFormatted, data, currentDate]);

  const toggleOpen = (title: string) => {
    setIsOpen((prevState) => {
      if (prevState.includes(title)) {
        return prevState.filter((item) => item !== title);
      } else {
        return [...prevState, title];
      }
    });
  };

  const monthesNames = React.useMemo(() => getMonthesNames(locale), []);
  const weekDaysNames = React.useMemo(
    () => getWeekDaysNames(firstWeekDayNumber, locale),
    []
  );

  const days = React.useMemo(
    () => selectedMonth.createMonthDays(),
    [selectedMonth, selectedYear]
  );

  const calendarDays = React.useMemo(() => {
    const monthNumberOfDays = getMonthNumberOfDays(
      selectedMonth.monthIndex,
      selectedYear
    );

    const prevMonthDays = createMonth({
      date: new Date(selectedYear, selectedMonth.monthIndex - 1),
      locale,
    }).createMonthDays();

    const nextMonthDays = createMonth({
      date: new Date(selectedYear, selectedMonth.monthIndex + 1),
      locale,
    }).createMonthDays();

    const firstDay = days[0];
    const lastDay = days[monthNumberOfDays - 1];

    const shiftIndex = firstWeekDayNumber - 1;
    const numberOfPrevDays =
      firstDay.dayNumberInWeek - 1 - shiftIndex < 0
        ? DAYS_IN_WEEK - (firstWeekDayNumber - firstDay.dayNumberInWeek)
        : firstDay.dayNumberInWeek - 1 - shiftIndex;

    const numberOfNextDays =
      DAYS_IN_WEEK - lastDay.dayNumberInWeek + shiftIndex > 6
        ? DAYS_IN_WEEK - lastDay.dayNumberInWeek - (DAYS_IN_WEEK - shiftIndex)
        : DAYS_IN_WEEK - lastDay.dayNumberInWeek + shiftIndex;

    const totalCalendarDays = days.length + numberOfPrevDays + numberOfNextDays;

    const result = [];

    for (let i = 0; i < numberOfPrevDays; i += 1) {
      const inverted = numberOfPrevDays - i;
      result[i] = prevMonthDays[prevMonthDays.length - inverted];
    }

    for (
      let i = numberOfPrevDays;
      i < totalCalendarDays - numberOfNextDays;
      i += 1
    ) {
      result[i] = days[i - numberOfPrevDays];
    }

    for (
      let i = totalCalendarDays - numberOfNextDays;
      i < totalCalendarDays;
      i += 1
    ) {
      result[i] = nextMonthDays[i - totalCalendarDays + numberOfNextDays];
    }

    return result;
  }, [selectedMonth.year, selectedMonth.monthIndex, selectedYear]);

  const onClickArrow = (direction: 'right' | 'left') => {
    if (mode === 'years' && direction === 'left') {
      return setSelectedYearsInterval(
        getYearsInterval(selectedYearsInterval[0] - 10)
      );
    }

    if (mode === 'years' && direction === 'right') {
      return setSelectedYearsInterval(
        getYearsInterval(selectedYearsInterval[0] + 10)
      );
    }

    if (mode === 'monthes' && direction === 'left') {
      const year = selectedYear - 1;
      if (!selectedYearsInterval.includes(year))
        setSelectedYearsInterval(getYearsInterval(year));
      return setSelectedYear(selectedYear - 1);
    }

    if (mode === 'monthes' && direction === 'right') {
      const year = selectedYear + 1;
      if (!selectedYearsInterval.includes(year))
        setSelectedYearsInterval(getYearsInterval(year));
      return setSelectedYear(selectedYear + 1);
    }

    if (mode === 'days') {
      const monthIndex =
        direction === 'left'
          ? selectedMonth.monthIndex - 1
          : selectedMonth.monthIndex + 1;
      if (monthIndex === -1) {
        const year = selectedYear - 1;
        setSelectedYear(year);
        if (!selectedYearsInterval.includes(year))
          setSelectedYearsInterval(getYearsInterval(year));
        return setSelectedMonth(
          createMonth({ date: new Date(selectedYear - 1, 11), locale })
        );
      }

      if (monthIndex === 12) {
        const year = selectedYear + 1;
        setSelectedYear(year);
        if (!selectedYearsInterval.includes(year))
          setSelectedYearsInterval(getYearsInterval(year));
        return setSelectedMonth(
          createMonth({ date: new Date(year, 0), locale })
        );
      }

      setSelectedMonth(
        createMonth({ date: new Date(selectedYear, monthIndex), locale })
      );
    }
  };

  const setSelectedMonthByIndex = (monthIndex: number) => {
    setSelectedMonth(
      createMonth({ date: new Date(selectedYear, monthIndex), locale })
    );
  };

  return {
    state: {
      mode,
      isOpen,
      isLoading,
      calendarDays,
      weekDaysNames,
      monthesNames,
      selectedDay,
      selectedMonth,
      selectedYear,
      selectedYearsInterval,
      filteredTimeIntervals,
      selectedDateFormatted,
    },
    functions: {
      onClickArrow,
      setMode,
      setSelectedDay,
      setSelectedMonthByIndex,
      setSelectedYear,
      setSelectedYearsInterval,
      toggleOpen,
    },
  };
};
