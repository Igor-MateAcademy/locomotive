import React from 'react';
import { Modal as AntModal, ModalProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const Modal: React.FC<ModalProps> = ({ children, ...rest }) => {
  return (
    <AntModal zIndex={1000} centered={true} footer={null} closeIcon={<CloseOutlined />} {...rest}>
      {children}
    </AntModal>
  );
};

export default Modal;
