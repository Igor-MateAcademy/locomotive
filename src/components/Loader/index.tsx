import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// styles
import styles from './styles.module.scss';

const Loader: React.FC = () => {
  return (
    <div className={styles.loader}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 56 }} />} />
    </div>
  );
};

export default Loader;
