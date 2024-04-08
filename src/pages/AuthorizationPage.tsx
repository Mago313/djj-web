import { Button } from '../components/Button';
import useAuthorization from '../hooks/useAuthorization';
import MainLayout from '../layouts/MainLayout';

import styles from '../styles/pages/AuthorizationPage.module.scss';

const AuthorizationPage = () => {
  const { state, functions } = useAuthorization();

  return (
    <MainLayout title="Авторизация" isArrow>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>Личный кабинет</div>

        <form
          onSubmit={functions.handleSubmit(functions.onSubmit)}
          className={styles.form}
        >
          <div className={styles.formGroup}>
            <h3>Логин</h3>
            <input
              {...functions.register('login', { required: true })}
              type="text"
              name="login"
              placeholder="Введите логин"
            />
            <h3>Пароль</h3>
            <input
              {...functions.register('password', { required: true })}
              type="password"
              name="password"
              placeholder="Введите пароль"
            />
          </div>
          <Button
            children={'Войти'}
            disabled={state.isDisabled}
            isLoading={state.isPending}
            onClick={() => {}}
          />
        </form>
      </div>
    </MainLayout>
  );
};

export default AuthorizationPage;
