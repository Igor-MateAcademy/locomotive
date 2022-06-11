import React, { useState, useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

// components
import { Modal, Button, notification } from 'components';

// stores
import { useStore } from 'stores';

// models
import { LocomotiveDTO } from 'models';

// styles
import styles from './styles.module.scss';

interface Props {
  children: React.ReactNode;
  update: () => void;
  locomotive?: LocomotiveDTO;
}

const { Item, useForm } = Form;

const LocomotiveModal: React.FC<Props> = ({ children, update, locomotive }) => {
  const [form] = useForm();
  const { locomotivesStore } = useStore();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [info, setInfo] = useState<Partial<LocomotiveDTO>>(locomotive ? { ...locomotive } : { type: 'DEFAULT' });

  const onToggleModal = () => {
    isOpen && form.resetFields();

    setIsOpen(!isOpen);
  };

  const submit = async () => {
    if (locomotive) {
      try {
        const status = await locomotivesStore.patchLocomotive(info.id, info);

        if (status === 200) {
          notification('success', 'Success!', 'New locomotive was successfully updated');
        } else {
          notification('warning', 'Oops...', 'Something went wrong');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const status = await locomotivesStore.createLocomotive(info);

        if (status === 201) {
          notification('success', 'Success!', 'New locomotive was successfully created');
        } else {
          notification('warning', 'Oops...', 'Something went wrong');
        }
      } catch (e) {
        console.log(e);
      }
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
        className={styles.modal}
        title={locomotive ? 'Details' : 'Create locomotive'}
      >
        <Form
          form={form}
          onFinish={submit}
          layout="vertical"
          validateTrigger={['onBlur', 'onChange', 'onSubmit']}
          initialValues={locomotive ? { ...locomotive } : { type: 'DEFAULT' }}
        >
          <Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'This field is required' },
              { min: 4, message: 'Locomotive name is too short' }
            ]}
          >
            <Input
              placeholder="Enter locomotive name"
              allowClear={true}
              onChange={e => {
                setInfo({
                  ...info,
                  name: e.target.value,
                });
              }}
            />
          </Item>

          <Item
            label="Type"
            name="type"
          >
            <Select options={[{ label: 'Default', value: 'DEFAULT' }, { label: 'Speedy', value: 'HIGHSPEED' }]} onSelect={e => {
              setInfo({
                ...info,
                type: e,
              });
            }} />
          </Item>

          <Button
            text={locomotive ? 'Update' : 'Create'}
            icon={<PlusOutlined />}
            htmlType="submit"
          />
        </Form>
      </Modal>
    </>
  );
};

export default LocomotiveModal;
