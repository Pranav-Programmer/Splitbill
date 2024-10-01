import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './MobileNavigationMenu.module.css';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';

const MobileNavigationMenu = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const pathToIndex = {
      'https://pranav-programmer.github.io/Contact-Form/': 5,
      '/profile': 2,
      '/login': 3,
      '/register': 4,
      '/' : 1,
    };

    const currentPath = router.asPath;

    if (pathToIndex[currentPath] !== undefined) {
      setActiveIndex(pathToIndex[currentPath]);
    }
    else {
        setActiveIndex(1);
      }
  }, [router.asPath]);

  return (
    <div className={styles.navigation}>
      <ul>
        <li className={`${styles.list} ${activeIndex === 1 ? styles.active : ''}`}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className={styles.icon}>
              <HouseOutlinedIcon />
            </span>
            <span className={styles.text}>Home</span>
            <span className={styles.circle}></span>
          </Link>
        </li>
        <li className={`${styles.list} ${activeIndex === 2 ? styles.active : ''}`}>
          <Link href="/profile" style={{ textDecoration: 'none' }}>
            <span className={styles.icon}>
              <AccountCircleOutlinedIcon />
            </span>
            <span className={styles.text}>Profile</span>
            <span className={styles.circle}></span>
          </Link>
        </li>
        <li className={`${styles.list} ${activeIndex === 3 ? styles.active : ''}`}>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <span className={styles.icon}>
              <LoginOutlinedIcon />
            </span>
            <span className={styles.text}>Login</span>
            <span className={styles.circle}></span>
          </Link>
        </li>
        <li className={`${styles.list} ${activeIndex === 4 ? styles.active : ''}`}>
          <Link href="/register" style={{ textDecoration: 'none' }}>
            <span className={styles.icon}>
              <HowToRegOutlinedIcon />
            </span>
            <span className={styles.text}>Register</span>
            <span className={styles.circle}></span>
          </Link>
        </li>
        <li className={`${styles.list} ${activeIndex === 5 ? styles.active : ''}`}>
          <Link href="https://pranav-programmer.github.io/Contact-Form/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <span className={styles.icon}>
              <MarkEmailReadOutlinedIcon />
            </span>
            <span className={styles.text}>Contact</span>
            <span className={styles.circle}></span>
          </Link>
        </li>
        <div className={styles.indicator} style={{ transform: `translateX(calc(70px * ${(activeIndex - 1)}))` }}></div>
      </ul>
    </div>
  );
};

export default MobileNavigationMenu;
