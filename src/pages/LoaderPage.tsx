import React from 'react';
import logo from '../assets/djj.png';
import umar from '../assets/umar.png';

import styles from '../styles/pages/Loader.module.scss';

const LoaderPage: React.FC = () => {
  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <div>
          <div className={styles.icons}>
            <div className={styles.emptyBtn}></div>
            <img src={logo} width={40} height={40} alt="" />
            <div className={styles.empty}></div>
          </div>
          <div className={styles.imgBlock}>
            <img className={styles.umarImg} src={umar} alt="" />
            <div className={styles.logo}>
              <span className={styles.apple}>DJJ</span>
              <span className={styles.mania}></span>
            </div>
            <p>уход за мужским имиджем</p>
          </div>
          <div>
            <img className={styles.rot} src={logo} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaderPage;
