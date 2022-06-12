import React, { useState, useEffect } from 'react';
import { Select, Empty } from 'antd';

// components
import LocomotiveModal from 'containers/LocomotivesList/LocomotiveModal';

// stores
import { useStore } from 'stores';

// models
import { DriverDTO, LocomotiveDTO } from 'models';

// styles
import styles from './styles.module.scss';

const Board: React.FC = () => {
  const { driversStore, locomotivesStore } = useStore();

  const [drivers, setDrivers] = useState<DriverDTO[]>([]);
  const [data, setData] = useState<LocomotiveDTO[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);

  const init = async () => {
    const _drivers = await driversStore.getDrivers();

    setDrivers(_drivers.data);
  };

  const driverHandler = async () => {
    if (!selectedDriver) return;

    try {
      const data = await locomotivesStore.getLocomotivesByDriver(selectedDriver);

      setData(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    driverHandler();
  }, [selectedDriver]);

  const Types = {
    'DEFAULT': 'Classic',
    'HIGHSPEED': 'Speedy',
  };

  return (
    <section className={styles.section}>
      <div className={styles.top}>
        <Select options={drivers.map(d => ({ label: `${d.firstName} ${d.lastName}`, value: d.id }))} onSelect={e => {
          setSelectedDriver(e);
        }} className={styles.select} placeholder="Select driver..." size="large" />
      </div>

      {data.length !== 0 ? (
        <ul className={styles.list}>
          {data.map(l => (
            <LocomotiveModal locomotive={l} update={init}>
              <li className={styles.item}>
                <button className={styles.button}>
                  <div className={styles.name}>
                    {l.name}
                  </div>

                  <div className={styles.box}>
                    <span className={styles.type}>{Types[l.type]}</span>
                  </div>
                </button>
              </li>
            </LocomotiveModal>
          ))}
        </ul>
      ) : (
        <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" description="Driver have not any trip yet" />
      )}
    </section>
  );
};

export default Board;
