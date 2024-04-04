import React from 'react';
import { styled } from 'styled-components';
import styles from '../styles/pages/Loader.module.scss';

type TProps = {
  width?: number;
  height?: number;
  src: string;
};

const LoadingBase = styled.img<TProps>``;

export const Loading: React.FC<TProps> = (props) => {
  return <LoadingBase {...props} className={styles.rot} />;
};
