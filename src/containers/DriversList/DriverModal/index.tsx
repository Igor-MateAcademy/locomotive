import React, { useState, ReactNode } from 'react';
import { Input, Form, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

// components
import { Modal, Button, notification } from 'components';

// models
import { DriverDTO } from 'models';

// stores
import { useStore } from 'stores';

// styles
import styles from './styles.module.scss';

interface Props {
  children: ReactNode;
  update: () => void;
  driver?: DriverDTO;
}

const { Item, useForm } = Form;

const DEFAULT_DRIVER: DriverDTO = {
  firstName: '',
  lastName: '',
  driverClass: 'LOW',
}

const DriverModal: React.FC<Props> = ({ children, update, driver }) => {
  const { driversStore } = useStore();
  const [form] = useForm();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [driverItem, setDriverItem] = useState<DriverDTO>(driver ? { ...driver } : { ...DEFAULT_DRIVER });

  const onToggleModal = () => {
    isOpen && form.resetFields();

    setIsOpen(!isOpen);
  };

  const inputHandler = (field: keyof DriverDTO, value: string) => {
    setDriverItem({
      ...driverItem,
      [field]: value,
    });
  };

  const onSubmit = async () => {
    if (driver) {
      await driversStore.patchDriver(driver.id && driver.id, driverItem);
    } else {
      const status = await driversStore.createDriver(driver);

      if (status === 201) {
        notification('success', 'Success!', 'New driver was successfully created');
      } else {
        notification('warning', 'Oops...', 'Something went wrong');
      }
    }

    onToggleModal();
    await update();
  };

  const deleteDriver = async () => {
    const status = await driversStore.deleteDriver(driver.id);

    if (status === 200) {
      notification('success', 'Success!', 'New driver was successfully deleted');
    } else {
      notification('warning', 'Oops...', 'Something went wrong');
    }

    onToggleModal();
    await update();
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, {
        onClick: onToggleModal,
      })}

      <Modal
        visible={isOpen}
        onCancel={onToggleModal}
        title={driver ? 'Driver details' : 'Create driver'}
      >
        <div className={styles.modal}>
          <Form
            layout="vertical"
            validateTrigger={['onBlur', 'onChange', 'onSubmit']}
            form={form}
            initialValues={driver ? { ...driver } : { ...DEFAULT_DRIVER }}
            onFinish={() => { onSubmit() }}
          >
            <Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: 'This field is required' },
                { min: 1, message: 'First name is too short' }
              ]}
            >
              <Input
                placeholder="Enter driver first name"
                onChange={event => {
                  inputHandler('firstName', event.target.value);
                }}
                allowClear={true}
              />
            </Item>

            <Item
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: 'This field is required' },
                { min: 1, message: 'Last name is too short' }
              ]}
            >
              <Input
                placeholder="Enter driver last name"
                onChange={event => {
                  inputHandler('lastName', event.target.value);
                }}
                allowClear={true}
              />
            </Item>


            <Item label="Driver experience" name="driverClass">
              <Select
                onSelect={(event: string) => {
                  inputHandler('driverClass', event);
                }}
                options={[
                  {
                    label: 'Expert',
                    value: 'HIGH',
                  },
                  {
                    label: 'Experienced',
                    value: 'MIDDLE',
                  },
                  {
                    label: 'Beginner',
                    value: 'LOW',
                  },
                ]}
              />
            </Item>

            <div className={styles.buttons}>
              <Button
                text={driver ? 'Update' : 'Create'}
                icon={<PlusOutlined />}
                htmlType="submit"
              />

              {driver && (
                <Button
                  text={'Delete'}
                  icon={<DeleteOutlined />}
                  onClick={deleteDriver}
                  danger
                  type="default"
                />
              )}
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default DriverModal;
