import React, { useState, ReactNode } from 'react';
import { Input, Form, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// components
import { Modal, Button } from 'components';

// models
import { DriverDTO } from 'models';

// stores
import { useStore } from 'stores';

// styles
import styles from './styles.module.scss';

interface Props {
  children: ReactNode;
}

const { Item, useForm } = Form;

const DEFAULT_DRIVER: DriverDTO = {
  firstName: '',
  lastName: '',
  driverClass: 'LOW',
}

const CreateDriverModal: React.FC<Props> = ({ children }) => {
  const { driversStore } = useStore(); 
  const [form] = useForm();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [driver, setDriver] = useState<DriverDTO>({
    ...DEFAULT_DRIVER,
  });

  const onToggleModal = () => {
    isOpen && form.resetFields();

    setIsOpen(!isOpen);
  };

  const inputHandler = (field: keyof DriverDTO, value: string) => {
    setDriver({
      ...driver,
      [field]: value,
    });
  };

  const onSubmit = async () => {
    const status = await driversStore.createDriver(driver);

    console.log(status);
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, {
        onClick: onToggleModal,
      })}

      <Modal
        visible={isOpen}
        onCancel={onToggleModal}
        title="Create driver"
      >
        <div className={styles.modal}>
          <Form
            layout="vertical"
            validateTrigger={['onBlur', 'onChange', 'onSubmit']}
            form={form}
            initialValues={{
              ...DEFAULT_DRIVER,
            }}
            onFinish={() => {onSubmit()}}
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

            <Button
              text="Create"
              icon={<PlusOutlined />}
              style={{ width: '40%' }}
              htmlType="submit"
            />
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default CreateDriverModal;

