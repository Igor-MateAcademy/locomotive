import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { PlusOutlined, DeleteOutlined, ArrowRightOutlined } from '@ant-design/icons';
import moment from 'moment';


// components
import { Loader, Button } from 'components';
import TripModal from './TripModal';

// stores
import { useStore } from 'stores';

// models
import { TripDTO } from 'models';

// styles
import styles from './styles.module.scss';

const TripsList: React.FC = () => {
  const { tripsStore } = useStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [finished, setFinished] = useState<TripDTO[]>([]);
  const [inTransit, setInTransit] = useState<TripDTO[]>([]);

  const init = async () => {
    setLoading(true);

    try {
      const _inTransit = await tripsStore.getTripsInTransit();
      const _finished = await tripsStore.getFinishedTrips();

      setInTransit(_inTransit);
      setFinished(_finished);
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
              <h1 className={styles.title}>Trip List</h1>

              <TripModal update={init}>
                <Button
                  text="Create New Trip"
                  icon={<PlusOutlined />}
                />
              </TripModal>
            </div>

            <div className={styles.trips}>
              <div className={styles.part}>
                <h2 className={styles.title}>In transit</h2>

                <ul className={styles.list}>
                  {inTransit.map(trip => (
                    <TripModal update={init} trip={trip}>
                      <li className={styles.item}>
                        <button className={styles.button}>
                          <div>
                            <div className={styles.city}>{trip.beginning}</div>

                            <div>
                              {moment(trip.startDate).format('DD-MM-YYYY H:mm')}
                            </div>
                          </div>

                          <div>
                            <ArrowRightOutlined />
                          </div>

                          <div>
                            <div className={styles.city}>{trip.destination}</div>

                            <div>
                              {moment(trip.endDate).format('DD-MM-YYYY H:mm')}
                            </div>
                          </div>
                        </button>
                      </li>
                    </TripModal>
                  ))}
                </ul>
              </div>

              <div className={styles.part}>
                <h2 className={styles.title}>Finished</h2>

                <ul className={styles.list}>
                  {finished.map(trip => (
                    <TripModal update={init} trip={trip}>
                      <li className={styles.item}>
                        <button className={styles.button}>
                          <div>
                            <div className={styles.city}>{trip.beginning}</div>

                            <div>
                              {moment(trip.startDate).format('DD-MM-YYYY H:mm')}
                            </div>
                          </div>

                          <div>
                            <ArrowRightOutlined />
                          </div>

                          <div>
                            <div className={styles.city}>{trip.destination}</div>

                            <div>
                              {moment(trip.endDate).format('DD-MM-YYYY H:mm')}
                            </div>
                          </div>
                        </button>
                      </li>
                    </TripModal>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )
      }
    </>
  );
};

export default observer(TripsList);