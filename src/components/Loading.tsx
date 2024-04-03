import React from 'react';
import styles from '../styles/pages/Loader.module.scss';
import { styled } from 'styled-components';

type TProps = {
  width?: number;
  heigth?: number;
  src: string;
};

const LoadingBase = styled.img<TProps>``;

export const Loading: React.FC<TProps> = (props) => {
  return <LoadingBase {...props} className={styles.rot} />;
};
