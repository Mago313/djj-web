import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/components/CategoriesCard.module.scss';

type TProps = {
  name: string;
  img: string;
  link: string;
};

const MenuBlock = ({ name, img, link }: TProps) => {
  return (
    <Link style={{ textDecoration: 'none' }} to={`${link}`}>
      <div className={styles.card}>
        <div className={styles.photo}>
          <img
            style={{ marginLeft: 20 }}
            src={img}
            alt=""
            width={60}
            height={60}
          />
        </div>
        <div className={styles.text}>{name}</div>
      </div>
    </Link>
  );
};

export default MenuBlock;
