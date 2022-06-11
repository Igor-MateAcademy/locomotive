import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Empty, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// components
import { Button, notification, Loader, Avatar } from 'components';
import DriverModal from './DriverModal';

// stores
import { useStore } from 'stores';

// models
import { DriverDTO } from 'models';

// styles
import styles from './styles.module.scss';

const CLASS = {
  'HIGH': 'Expert',
  'MIDDLE': 'Experienced',
  'LOW': 'Beginner',
};

const DriversList: React.FC = () => {
  const { driversStore } = useStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [drivers, setDrivers] = useState<DriverDTO[]>([]);

  const init = async () => {
    setLoading(true);

    try {
      const { data, status } = await driversStore.getDrivers();

      if (status !== 200) {
        notification('warning', 'Oops!', 'Something went wrong. Please try again');
      } else {
        setDrivers(data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {
        loading ? (
          <Loader />
        ) : (
          <section className={styles.section}>
            <div className={styles.top}>
              <h1 className={styles.title}>Driver List</h1>

              <DriverModal update={init}>
                <Button
                  text="Create New Driver"
                  icon={<PlusOutlined />}
                />
              </DriverModal>
            </div>

            <div className={styles.container}>
              {drivers.length !== 0
                ? (
                  <ul className={styles.list}>
                    {drivers.map(driver => (
                      <li className={styles.item} key={driver.id}>
                        <DriverModal driver={driver} update={init}>
                          <button className={styles.button}>
                            <Card>
                              <div className={styles.avatar}>
                                <Avatar size={56} firstName={driver.firstName} lastName={driver.lastName} />
                              </div>

                              <div className={styles.name}>
                                {`${driver.firstName} ${driver.lastName}`}
                              </div>

                              <div className={styles.class}>
                                {CLASS[driver.driverClass]}
                              </div>
                            </Card>
                          </button>
                        </DriverModal>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" description="Drivers list is empty" />
                )}
            </div>
          </section >
        )}
    </>
  );
};

export default observer(DriversList);
