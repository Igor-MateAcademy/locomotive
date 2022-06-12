import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Empty } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

// components
import { notification, Loader, Button } from 'components';
import LocomotiveModal from './LocomotiveModal';

// stores
import { useStore } from 'stores';

// models
import { LocomotiveDTO } from 'models';

// styles
import styles from './styles.module.scss';

const Types = {
  'DEFAULT': 'Classic',
  'HIGHSPEED': 'Speedy',
};

const LocomotivesList: React.FC = () => {
  const { locomotivesStore } = useStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [free, setFree] = useState<LocomotiveDTO[]>([]);
  const [busy, setBusy] = useState<LocomotiveDTO[]>([]);

  const init = async () => {
    setLoading(true);

    try {
      const free = await locomotivesStore.getFreeLocomotives();
      const busy = await locomotivesStore.getBusyLocomotives();

      setFree(free.data);
      setBusy(busy.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteLocomotive = async (id: number) => {
    try {
      const status = await locomotivesStore.deleteLocomotive(id);

      if (status === 200) {
        notification('success', 'Success!', 'Locomotive was successfully deleted');

        setFree([...free.filter(i => i.id !== id)]);
        setBusy([...busy.filter(i => i.id !== id)]);
      } else {
        notification('warning', 'Oops...', 'Something went wrong');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className={styles.section}>
          <div className={styles.top}>
            <h1 className={styles.title}>Locomotives List</h1>

            <LocomotiveModal update={init}>
              <Button
                text="Create New Locomotive"
                icon={<PlusOutlined />}
              />
            </LocomotiveModal>
          </div>

          {
            free.length === 0 && busy.length === 0
              ? (
                <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" description="Locomotive list is empty" />
              ) : (
                <div className={styles.container}>
                  <div className={styles.part}>
                    <h2 className={styles.title}>
                      Free
                    </h2>

                    <ul className={styles.list}>
                      {free.map(l => (
                        <LocomotiveModal locomotive={l} update={init} key={l.id}>
                          <li className={styles.item}>
                            <button className={styles.button}>
                              <div className={styles.name}>
                                {l.name}
                              </div>

                              <div className={styles.box}>
                                <span className={styles.type}>{Types[l.type]}</span>

                                <button className={styles.delete} onClick={() => {
                                  deleteLocomotive(l.id);
                                }}>
                                  <DeleteOutlined className={styles.icon} />
                                </button>
                              </div>
                            </button>
                          </li>
                        </LocomotiveModal>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.part}>
                    <h2 className={styles.title}>
                      Busy
                    </h2>

                    <ul className={styles.list}>
                      {busy.map(l => (
                        <LocomotiveModal locomotive={l} update={init} key={l.id}>
                          <li className={styles.item}>
                            <button className={styles.button}>
                              <div className={styles.name}>
                                {l.name}
                              </div>

                              <div className={styles.box}>
                                <span className={styles.type}>{Types[l.type]}</span>

                                <button className={styles.delete} onClick={() => {
                                  deleteLocomotive(l.id);
                                }}>
                                  <DeleteOutlined className={styles.icon} />
                                </button>
                              </div>
                            </button>
                          </li>
                        </LocomotiveModal>
                      ))}
                    </ul>
                  </div>
                </div>
              )
          }
        </section>
      )}
    </>
  );
};

export default observer(LocomotivesList);
