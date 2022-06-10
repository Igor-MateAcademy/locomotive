import React from 'react';
import { Button as AntButton, ButtonProps } from 'antd';

// styles
import styles from './styles.module.scss';

interface Props extends ButtonProps {
  text: string;
}

const Button: React.FC<Props> = ({ text, ...props }) => {
  return (
    <div className={styles.button}>
      <AntButton type="primary" {...props}>{text}</AntButton>
    </div>
  );
};

export default Button;
