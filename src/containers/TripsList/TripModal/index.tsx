import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, TimePicker } from 'antd';
import cn from 'classnames';
import moment from 'moment';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

// components
import { Modal, Button, notification } from 'components';

// stores
import { useStore } from 'stores';

// models
import { TripDTO, CreateTripDTO, LocomotiveDTO, DriverDTO } from 'models';

// styles
import styles from './styles.module.scss';

interface Props {
  children: React.ReactNode;
  update: () => void;
  trip?: TripDTO,
}

const { Item, useForm } = Form;

const CITIES = ['Kyiv', 'Zaporizhya', 'Dnipro', 'Odesa', 'Lytsk'];
const STATIONS = {
  'Kyiv': ['Central', 'West'],
  'Zaporizhya': ['Central', 'East'],
  'Dnipro': ['Central', 'South', 'East'],
  'Odesa': ['Central', 'West'],
  'Lytsk': ['Central'],
};
const TRAIN = {
  'LONG': 'Large',
  'SHORT': 'Small',
  'CHILD': 'Child',
};

const TripModal: React.FC<Props> = ({ trip, update, children }) => {
  const { locomotivesStore, driversStore, tripsStore } = useStore();
  const [form] = useForm();

  const [open, setOpen] = useState<boolean>(false);
  const [info, setInfo] = useState<Partial<CreateTripDTO>>(trip
    ? {
      locomotiveId: trip.locomotive.id,
      driverId: trip.driver.id,
      startDate: moment(trip.startDate),
      endDate: moment(trip.endDate),
      startFuelLevel: trip.startFuelLevel,
      endFuelLevel: trip.endFuelLevel,
      beginning: trip.beginning,
      destination: trip.destination,
      trainType: trip.trainType,
      exitPoint: trip.exitPoint,
    }
    : {}
  );
  const [locomotives, setLocomotives] = useState<LocomotiveDTO[]>([]);
  const [drivers, setDrivers] = useState<DriverDTO[]>([]);

  const init = async () => {
    const locomotives = await locomotivesStore.getFreeLocomotives();
    const drivers = await driversStore.getFreeDrivers();

    setLocomotives(trip ? [...locomotives.data, trip.locomotive] : locomotives.data);
    setDrivers(trip ? [...drivers.data, trip.driver] : drivers.data);
  };

  const onToggleModal = () => {
    open && form.resetFields();

    setOpen(!open);
  };

  const infoHandler = (field: keyof CreateTripDTO, value: number | string | moment.Moment) => {
    setInfo({
      ...info,
      [field]: value,
    });
  };

  const deleteTrip = async () => {
    const status = await tripsStore.deleteTrip(trip.id);

    if (status === 200) {
      notification('success', 'Success!', 'Trip was successfully deleted');
    } else {
      notification('warning', 'Oops...', 'Something went wrong');
    }

    onToggleModal();
    await update();
  };

  const submit = async () => {
    if (trip) {
      const status = await tripsStore.patchTrip(trip.id, info);

      if (status === 304) {
        notification('success', 'Success!', 'Trip was successfully updated');
      } else {
        notification('warning', 'Oops...', 'Something went wrong');
      }
    } else {
      const status = await tripsStore.createTrip({
        ...info,
        startDate: moment(info.startDate).seconds(0).format('YYYY-MM-DD H:mm:ss'),
        endDate: moment(info.endDate).seconds(0).format('YYYY-MM-DD H:mm:ss'),
      });

      if (status === 201) {
        notification('success', 'Success!', 'Trip was successfully created');
      } else {
        notification('warning', 'Oops...', 'Something went wrong');
      }
    }

    onToggleModal();
    await update();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, {
        onClick: onToggleModal,
      })}

      <Modal
        visible={open}
        onCancel={onToggleModal}
        title={trip ? 'Details' : 'Create trip'}
        className={styles.modal}
      >
        <Form
          form={form}
          onFinish={submit}
          layout="vertical"
          validateTrigger={['onBlur', 'onChange', 'onSubmit']}
          initialValues={trip ? { ...info } : {}}
        >
          <div className={cn(styles.info, styles.part)}>
            <Item label="Driver" name="driverId" rules={[{ required: true, message: 'Driver field is required' }]}>
              <Select options={drivers.map(d => ({ label: `${d.firstName} ${d.lastName}`, value: d.id }))} onSelect={e => {
                infoHandler('driverId', e);
              }} />
            </Item>

            <div>
              <Item label="Locomotive" name="locomotiveId" rules={[{ required: true, message: 'Locomotive field is required' }]}>
                <Select options={locomotives.map(l => ({ label: l.name, value: l.id }))} onSelect={e => {
                  infoHandler('locomotiveId', e);
                }} />
              </Item>

              <Item label="Train type" name="trainType" rules={[{ required: true, message: 'Train type field is required' }]}>
                <Select
                  options={[
                    {
                      label: TRAIN['LONG'],
                      value: 'LONG',
                    },
                    {
                      label: TRAIN['SHORT'],
                      value: 'SHORT',
                    },
                    {
                      label: TRAIN['CHILD'],
                      value: 'CHILD',
                    },
                  ]}
                  onSelect={e => {
                    infoHandler('trainType', e);
                  }}
                />
              </Item>
            </div>
          </div>

          <div className={cn(styles.cities, styles.part)}>
            <Item label="Start" name="beginning" rules={[{ required: true, message: 'Start field is required' }]}>
              <Select placeholder="Enter name" options={CITIES.map(city => ({ label: city, value: city }))} onSelect={e => {
                infoHandler('beginning', e);
              }} />
            </Item>

            <div>
              <Item label="Destination" name="destination" rules={[{ required: true, message: 'Destination field is required' }]}>
                <Select placeholder="Enter name" options={CITIES.map(city => ({ label: city, value: city }))} onSelect={e => {
                  infoHandler('destination', e);
                  form.resetFields(['exitPoint']);
                }} />
              </Item>

              <Item label="Station" name="exitPoint" rules={[{ required: true, message: 'Station field is required' }]}>
                <Select options={[...STATIONS[info.destination] || []].map(i => ({ label: i, value: i }))} onSelect={e => {
                  infoHandler('exitPoint', e);
                }} />
              </Item>
            </div>
          </div>

          <div className={cn(styles.dates, styles.part)}>
            <div className={styles.date}>
              <Item label="Date" name="startDate" rules={[{ required: true, message: 'Start field is required' }]}>
                <DatePicker format="DD-MM-YYYY" onChange={e => {
                  setInfo({
                    ...info,
                    startDate: moment(info.startDate).date(e.date()),
                  });
                }} />
              </Item>

              <Item label="Time" name="startDate">
                <TimePicker format="H:mm" onChange={e => {
                  setInfo({
                    ...info,
                    startDate: moment(info.startDate).hours(e.hours()).minutes(e.minutes()),
                  });
                }}
                />
              </Item>
            </div>

            <div className={styles.date}>
              <Item label="Date" name="endDate" rules={[{ required: true, message: 'To field is required' }]}>
                <DatePicker format="DD-MM-YYYY" onChange={e => {
                  setInfo({
                    ...info,
                    endDate: moment(info.endDate).date(e.date()),
                  });
                }} />
              </Item>

              <Item label="Time" name="endDate">
                <TimePicker format="H:mm" onChange={e => {
                  setInfo({
                    ...info,
                    endDate: moment(info.endDate).hours(e.hours()).minutes(e.minutes()),
                  });
                }} />
              </Item>
            </div>
          </div>

          <div className={cn(styles.fuel, styles.part)}>
            <Item label="Fuel value" name="startFuelLevel" rules={[{ required: true, message: 'Fuel start field is required' }, { pattern: /^[0-9]{0,10}.?[0-9]{1,2}$/g, message: 'Value must be a number' }]}>
              <Input onChange={e => {
                infoHandler('startFuelLevel', +e.target.value);
              }} />
            </Item>

            <Item label="Fuel rest" name="endFuelLevel" rules={[{ required: true, message: 'Fuel rest field is required' }, { pattern: /^[0-9]{0,10}.?[0-9]{1,2}$/g, message: 'Value must be a number' }]}>
              <Input onChange={e => {
                infoHandler('endFuelLevel', e.target.value);
              }} />
            </Item>
          </div>

          <div className={styles.buttons}>
            <Button
              text={trip ? 'Update' : 'Create'}
              icon={<PlusOutlined />}
              htmlType="submit"
            />

            {trip && (
              <Button
                text={'Delete'}
                icon={<DeleteOutlined />}
                onClick={deleteTrip}
                danger
                type="default"
              />
            )}
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default TripModal;
