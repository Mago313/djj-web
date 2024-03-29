type TProps = {
  selectedDate: Date;
  selectedTime: string;
};

export const formatDateISO = ({ selectedDate, selectedTime }: TProps) => {
  const [hours, minutes] = selectedTime.split(':');
  const selectedDateTime = new Date(selectedDate);
  selectedDateTime.setHours(Number(hours));
  selectedDateTime.setMinutes(Number(minutes));

  const year = selectedDateTime.getFullYear();
  const month = String(selectedDateTime.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDateTime.getDate()).padStart(2, '0');
  const hoursFormatted = String(selectedDateTime.getHours()).padStart(2, '0');
  const minutesFormatted = String(selectedDateTime.getMinutes()).padStart(
    2,
    '0'
  );

  const formattedDateTime = `${year}-${month}-${day}T${hoursFormatted}:${minutesFormatted}:00.000`;
  return { formattedDateTime };
};
