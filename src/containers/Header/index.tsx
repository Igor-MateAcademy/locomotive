import React from 'react';
import { Link } from 'react-router-dom';

// styles
import styles from './styles.module.scss';

const Header: React.FC = () => {
  const navbar = [
    {
      key: 0,
      title: 'Home',
      path: '/board',
    },
    {
      key: 1,
      title: 'Drivers',
      path: '/drivers',
    },
    {
      key: 2,
      title: 'Locomotives',
      path: '/locomotives',
    },
    {
      key: 3,
      title: 'Trips',
      path: '/trips',
    }
  ];

  return (
    <div className={styles.header}>
      <ul className={styles.list}>
        {navbar.map(item => (
          <li className={styles.item} key={item.key}>
            <Link to={item.path} className={styles.link}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Header;
