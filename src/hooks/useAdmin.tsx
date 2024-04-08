import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UIEventHandler, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseService } from '../api/api';
import { ReactComponent as Addition } from '../assets/addition.svg';
import { ReactComponent as Arrow } from '../assets/arrow.svg';
import styles from '../styles/components/CategoriesCard.module.scss';
import { Appointment } from '../types/category';
import PhoneNumber from '../utils/helpers/formatPhone';
import { useAdminContext } from './useAdminContext';

export const formatter = new Intl.DateTimeFormat('ru', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZone: 'UTC',
});

export async function fetchCheckIsDayOff() {
  const { data } = await baseService.get('/auth/status');
  return data;
}

export const useAdmin = () => {
  const {
    admin: {
      data: { user },
      isLoading: adminLoading,
    },
    setAdmin,
  } = useAdminContext();
  const queryClient = useQueryClient();
  const [isCardOpen, setIsCardOpen] = useState<string>('');
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [limit, setLimit] = useState(7);
  const [appointments, setAppointments] = useState<Appointment[]>();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const replace = useNavigate();

  const { isLoading, isRefetching } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data } = await baseService.get(
        `/appointments/get?limit=${limit}`
      );
      setAppointments(data.appointments);
      setHasMore(data.hasMore);
      return data;
    },
    enabled: user.isAdmin,
  });

  const handleScroll: UIEventHandler<HTMLDivElement> = (event) => {
    const target = event.currentTarget as HTMLDivElement;
    const bottom =
      target.scrollHeight - target.scrollTop === target.clientHeight;

    if (bottom && hasMore) {
      setLimit((prevLimit) => prevLimit + 2);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  };

  const { mutate: deleteAppointment } = useMutation({
    mutationFn: (id: string) => {
      setAppointments((prevAppointments) =>
        prevAppointments?.filter((a) => a._id !== id)
      );
      return baseService.delete(`/appointments/delete/${id}`);
    },
  });

  const { mutate } = useMutation({
    mutationFn: (checked: boolean) => {
      return baseService.post(`/auth/status`, { isDayOff: checked });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dayOff'] });
    },
  });

  const toggleOpen = (cardId: string) => {
    setOpenCardId(openCardId === cardId ? null : cardId);
    if (openCardId !== cardId) {
      setIsCardOpen(cardId);
    }
  };

  const handleSwitch = (checked: boolean) => {
    setAdmin((prevAdmin) => ({
      ...prevAdmin,
      data: { user: { ...prevAdmin.data.user, isDayOff: checked } },
    }));
    mutate(checked);
  };

  useEffect(() => {
    if (!user.isAdmin && adminLoading) {
      replace('/sign-in', { replace: true });
    }
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: Appointment; index: number }) => {
      return (
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
                <Arrow
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

            {isCardOpen && (
              <div
                className={`${styles.hide__container} ${isCardOpen ? styles.open : undefined}`}
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

            <Addition
              fill={'#fff'}
              width={20}
              height={20}
              style={{
                transform: 'rotate(45deg)',
              }}
              onClick={() => {
                deleteAppointment(item._id);
              }}
            />
          </div>
        </div>
      );
    },

    []
  );

  return {
    state: {
      appointments,
      openCardId,
      isCardOpen,
      isLoading,
      isRefetching,
      user,
    },
    functions: {
      deleteAppointment,
      handleScroll,
      handleSwitch,
      renderItem,
      toggleOpen,
    },
  };
};