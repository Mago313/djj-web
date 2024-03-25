import React from 'react';
import styles from '../styles/components/Button.module.scss';
import imgStyles from '../styles/pages/Loader.module.scss';
import loading from '../assets/loading.svg';

type TProps = {
  title: string;
  disabled?: boolean;
  isLoading: boolean;
  btnWidth?: number;
  onClick: any;
};

export const Button = ({
  title,
  btnWidth,
  disabled,
  isLoading,
  onClick,
}: TProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{ width: btnWidth }}
      className={`${styles.formSubmitBtn} ${disabled ? styles.disabled : undefined}`}
    >
      {isLoading ? (
        <img
          className={imgStyles.rot}
          width={20}
          height={20}
          src={loading}
          alt=""
        />
      ) : (
        title
      )}
    </button>
  );
};
