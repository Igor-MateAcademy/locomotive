import React from 'react';
import { notification as antNotification } from 'antd';

import styles from './styles.module.scss';

type NotificationType = 'success' | 'warning' | 'info';

const notification = (type: NotificationType, title: string, message: string) => {
  antNotification[type]({
    message: (
      <div className={styles.title}>
        {title}
      </div>
    ),
    description: <span className={styles.message}>{message}</span>,
    duration: 2,
    top: 140,
    className: styles.container,
  });
};

export default notification;