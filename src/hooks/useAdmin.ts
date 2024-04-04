import Cookies from 'js-cookie';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { baseService } from '../api/api';
import { useAdminContext } from './useAdminContext';

export async function fetchCheckIsDayOff() {
  const { data } = await baseService.get('/auth/status');
  return data;
}

async function fetchAppointments() {
  const accessToken = Cookies.get('accessToken');
  const { data } = await baseService.get('/appointments/get', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return data;
}

export const useAdmin = () => {
  const {
    admin: {
      data: { user },
    },
    setAdmin,
  } = useAdminContext();

  const [isOpen, setIsOpen] = useState<string>('');
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const { data: appointments, isLoading } = useQuery(
    'appointments',
    fetchAppointments
  );

  const { mutate: deleteAppointment } = useMutation(
    ({ id, isActive }: { id: string; isActive: boolean }) => {
      return baseService.patch(`/appointments/status/${id}`, isActive);
    }
  );

  const { mutate } = useMutation(({ isDayOff }: { isDayOff: boolean }) => {
    return baseService.post(`/auth/status`, { isDayOff });
  });

  const toggleOpen = (cardId: string) => {
    setOpenCardId(openCardId === cardId ? null : cardId);
    if (openCardId !== cardId) {
      setIsOpen(cardId);
    }
  };

  const handleSwitch = (checked: boolean) => {
    setAdmin((prevAdmin) => ({
      ...prevAdmin,
      data: { user: { ...prevAdmin.data.user, isDayOff: checked } },
    }));
    mutate({ isDayOff: checked });
  };

  return {
    state: {
      appointments,
      openCardId,
      isLoading,
      isOpen,
      user,
    },
    functions: {
      deleteAppointment,
      handleSwitch,
      toggleOpen,
    },
  };
};
