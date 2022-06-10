import React from 'react';
import { Outlet } from 'react-router-dom';

// containers
import { Header } from 'containers';

// styles
import styles from './styles.module.scss';

const Layout: React.FC = () => {
  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
