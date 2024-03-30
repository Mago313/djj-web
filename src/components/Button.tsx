import styles from '../styles/components/Button.module.scss';
import imgStyles from '../styles/pages/Loader.module.scss';
import loading from '../assets/loading.svg';

type TProps = {
  title: string;
  isDisabled?: boolean;
  isLoading: boolean;
  btnWidth?: number;
  onClick: any;
};

export const Button = ({
  title,
  btnWidth,
  isDisabled,
  isLoading,
  onClick,
}: TProps) => {
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      style={{ width: btnWidth }}
      className={`${styles.formSubmitBtn} ${isDisabled ? styles.disabled : undefined}`}
    >
      {isLoading ? (
        <img
          className={imgStyles.rot}
          width={20}
          height={19}
          src={loading}
          alt=""
        />
      ) : (
        title
      )}
    </button>
  );
};
