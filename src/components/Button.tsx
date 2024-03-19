import React from 'react';
import styles from '../styles/components/Button.module.scss';

type TProps = {
  title: string;
  disabled?: boolean;
  onClick: any;
};

export const Button = ({ title, disabled, onClick }: TProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${styles.formSubmitBtn} ${disabled ? styles.disabled : undefined}`}
    >
      {title}
    </button>
  );
};
