import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from '../styles/pages/AuthorizationPage.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import MainLayout from '../layouts/Mainlayout';
import { Button } from '../components/Button';
import { useAppDispatch, useAppSelector } from '../store/store';
import { IShippingFields } from '../types/admin';
import { signIn } from '../store/adminSlise';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  login: yup.string().required('Поле не может быть пустым'),
  password: yup.string().required('Поле не может быть пустым'),
});

const AuthorizationPage = () => {
  const { loading, isAdmin, error } = useAppSelector(
    (state) => state.adminSlice
  );
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IShippingFields> = (data: IShippingFields) => {
    dispatch(signIn(data));
  };

  const redirect = useNavigate();

  useEffect(() => {
    isAdmin && redirect('/', { replace: true });
  }, [isAdmin]);

  const { login, password } = watch();

  const isDisabled = login?.length === 0 || password?.length === 0;

  return (
    <MainLayout title="Авторизация" isArrow>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>Личный кабинет</div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGroup}>
            <h3>Логин</h3>
            <input
              {...register('login', { required: true })}
              type="text"
              name="login"
              placeholder="Введите логин"
            />
            <h3>Пароль</h3>
            <input
              {...register('password', { required: true })}
              type="password"
              name="password"
              placeholder="Введите пароль"
            />
          </div>
          <Button
            children={'Войти'}
            disabled={isDisabled}
            isLoading={loading}
            onClick={() => onSubmit}
          />
        </form>
      </div>
    </MainLayout>
  );
};

export default AuthorizationPage;
