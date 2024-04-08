import React from 'react';
import styles from '../styles/components/Input.module.scss';

type TProps = {
  title: string;
  children: React.ReactChild;
  isValid: boolean;
};

export const Input = ({ children, title, isValid }: TProps) => {
  return (
    <div
      style={{
        border: isValid ? '1px solid green' : undefined,
      }}
      className={styles.ui__wrapper}
    >
      <div className={styles.input__wrapper}>
        <legend>
          <label className={isValid ? styles.valid : styles.error}>
            {title}
          </label>
        </legend>
        <div className={styles.textfield}>{children}</div>
      </div>
    </div>
  );
};
