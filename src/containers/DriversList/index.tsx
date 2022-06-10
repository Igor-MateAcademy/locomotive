import React, { useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';

// components
import { Button } from 'components';
import CreateDriverModal from './CreateDriverModal';

// stores
import { useStore } from 'stores';

// styles
import styles from './styles.module.scss';

const DriversList: React.FC = () => {
  const { driversStore } = useStore();

  const init = async () => {
    console.log(await driversStore.getDrivers());
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.top}>
        <h1 className={styles.title}>Driver List</h1>

        <CreateDriverModal>
          <Button
            text="Create New Driver"
            icon={<PlusOutlined />}
          />
        </CreateDriverModal>
      </div>
    </section>
  );
};

export default DriversList;
