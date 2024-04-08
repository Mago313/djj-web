import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from 'src/api/api';
import admin from '../assets/admin.png';
import arrow from '../assets/arrow.svg';
import logo from '../assets/djj.png';
import exit from '../assets/exit.svg';
import { useAdminContext } from '../hooks/useAdminContext';
import styles from '../styles/pages/MainLayoutPage.module.scss';

interface Props {
  title: string;
  subtitle?: string;
  children: any;
  isArrow?: boolean;
  isAdmin?: boolean;
}

const MainLayout: React.FC<Props> = ({
  children,
  title,
  subtitle,
  isArrow,
  isAdmin,
}) => {
  const navigate = useNavigate();
  const {
    admin: {
      data: { user },
    },
  } = useAdminContext();

  return (
    <div className={styles.root}>
      <div>
        <div className={styles.headerTitle}>
          <div className={styles.headerIcons}>
            <button className={styles.goBack} onClick={() => navigate(-1)}>
              {isArrow && <img src={arrow} alt="" width={10} height={15} />}
            </button>

            <img
              onClick={() => navigate('/', { replace: true })}
              src={logo}
              alt=""
              width={40}
              height={40}
            />

            {user.isAdmin && (
              <Link
                onClick={() => {
                  if (isAdmin) {
                    logout();
                  }
                }}
                to="/admin"
                className={styles.admin}
              >
                {
                  <img
                    src={isAdmin ? exit : admin}
                    alt=""
                    width={21}
                    height={21}
                  />
                }
              </Link>
            )}
          </div>
          <div className={styles.titleSubtitle}>
            <div>
              <h1>{title}</h1>
            </div>
            <p>{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
