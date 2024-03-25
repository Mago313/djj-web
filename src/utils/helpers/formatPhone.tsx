function formatPhoneNumber(phoneNumber: string) {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');

  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }

  return null;
}

function PhoneNumber({ phoneNumber }: { phoneNumber: string }) {
  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
  return (
    <a
      style={{ color: '#306289', textDecoration: 'none' }}
      href={`tel:+${phoneNumber}`}
    >
      {formattedPhoneNumber}
    </a>
  );
}

export default PhoneNumber;
