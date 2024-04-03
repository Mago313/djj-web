import styles from '../styles/components/Button.module.scss';
import loading from '../assets/loading.svg';
import { styled } from 'styled-components';
import { Loading } from './Loading';

type TProps = {
  children: React.ReactChild;
  isLoading?: boolean;
  disabled?: boolean;
  backgroundColor?: string;
  height?: string;
  width?: string;
  color?: string;
  onClick: any;
};

const ButtonBase = styled.button<TProps>`
  opacity: ${(props) => (props.disabled ? '0.5' : '1')};
  color: ${(props) => (props.color ? props.color : '#fff')};
  width: ${(props) => (props.width ? props.width : '100%')};
  height: ${(props) => (props.height ? props.height : '45px')};
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : '#212121'};
`;

export const Button: React.FC<TProps> = ({
  children,
  isLoading,
  backgroundColor,
  height,
  width,
  color,
  onClick,
  disabled,
}) => {
  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      className={styles.btn}
      children={isLoading ? <Loading src={loading} /> : children}
      style={{ backgroundColor, height, width, color }}
    />
  );
};
