import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import styles from './Navbar.module.css';
import HouseSidingIcon from '@mui/icons-material/HouseSiding';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoginIcon from '@mui/icons-material/Login';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EmailIcon from '@mui/icons-material/Email';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import '@/pages/app.css';


const Navbar = ({ isFormVisible, toggleFormVisibility, setShowSwitchModal }) => {
  const router = useRouter();
  const [scrolling, setScrolling] = useState(false);
  const [scrollingTrp, setScrollingTrp] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isTransparentPage = router.pathname === '/bill/[id]';
  
    useEffect(() => {
    const savedMode = localStorage?.getItem('darkMode');
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode));
    }
  }, []);

  // useEffect(() => {
  //   const handleScroll2 = () => {
  //     if (window.scrollY < 85) {
  //       setScrollingTrp(true);
  //     } else {
  //       setScrollingTrp(false);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll2);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll2);
  //   };
  // }, []);

  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1239);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMenuToggle = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <nav className={`${styles.navbar} ${isTransparentPage ? styles.transparent : (scrolling ? styles.scrolling : '')}`}>
      <div className={styles.navbarContent}>
        <div className={styles.navbarLeft}>
          <Link className={router.pathname === '/bill/[id]' && styles.hideLogo} href="/">
            <Image
              src="/logo.png"
              alt="dp"
              priority={true}
              width={150}
              height={150}
              style={{ cursor: 'pointer', borderRadius: '10px', width: '170px', height: 'auto' }}
            />
          </Link>
          <ul className={styles.navbarList}>
              <li className={styles.navbarItem} style={{marginTop:'.5rem'}}>
                <Link href="/" style={{textDecoration:'none'}}>
                  <div className={router.pathname === '/' ? styles.activeLink : styles.inactiveLink}>Home</div>
                </Link>
              </li>
              <li className={styles.navbarItem} style={{marginTop:'.5rem'}}>
                <Link href="/register" style={{textDecoration:'none'}}>
                  <div className={router.pathname === '/register' ? styles.activeLink : styles.inactiveLink}>Register</div>
                </Link>
              </li>
              <li className={styles.navbarItem} style={{marginTop:'.5rem'}}>
                <Link href="/login" style={{textDecoration:'none'}}>
                  <div className={router.pathname === '/login' ? styles.activeLink : styles.inactiveLink}>Login</div>
                </Link>
              </li>
              <li className={styles.navbarItem} style={{marginTop:'.5rem'}}>
              <Link href="https://pranav-programmer.github.io/Contact-Form/" target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>
                  <div className={router.pathname === '/login' ? styles.activeLink : styles.inactiveLink} style={{display: router.pathname === '/register' || router.pathname === '/login' ? 'none' : 'block'}}>Contact</div>
                </Link>
              </li>
          </ul>
        </div>
        <div className={styles.navbarRight}>
          {!isMobile && (
            <ul className={styles.navbarList}>
             <div style={{marginTop:'-.3rem', marginRight:'.5rem'}}>
                <input 
                  type="checkbox" 
                  className="checkbox" 
                  id="checkbox" 
                  checked={isDarkMode} 
                  onChange={toggleDarkMode} 
                />
                <label htmlFor="checkbox" className="checkbox-label" style={{display: router.pathname === '/register' || router.pathname === '/login' || router.pathname === '/' || router.pathname === '/bill/[id]' ? 'none' : 'block'}}>
                  <DarkModeIcon className="famoon"/>
                  <WbSunnyIcon className="fasun"/>
                  <span className="ball"></span>
                </label>
              </div>
              <Link href="/profile">
                <Image
                  src="/dp.jpg"
                  alt="profile"
                  priority={false}
                  width={34}
                  height={34}
                  style={{ cursor: 'pointer', borderRadius: '50%', marginTop:'-3px', display: router.pathname === '/register' || router.pathname === '/login' ? 'none' : 'block'}}
                />
              </Link>
               <button onClick={toggleFormVisibility} style={{ width:'2rem', height:'2rem', backgroundColor: '#1e40af', color: 'white', padding: '2px 1px 0 1px', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', marginLeft:'10px', marginTop:'-2px', display: router.pathname === '/register' || router.pathname === '/login' || router.pathname === '/profile' || router.pathname === '/bill/[id]' ? 'none' : 'block'}}>
                    {isFormVisible ? <RemoveCircleIcon /> : <AddCircleIcon />}
                </button>
                <button style={{ backgroundColor: '#1e40af', color: 'white', padding: '2px 1px 0 1px', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', marginLeft:'10px', marginBottom:'10px', display: router.pathname === '/profile' ? 'block' : 'none', marginBottom:'.8rem'}}>
                  <CameraswitchIcon onClick={() => setShowSwitchModal(true)}/>
                </button>
            </ul>
          )}
          {isMobile && (
            <div className={styles.mobileMenu} style={{ marginRight: '35px'}}>
              <div style={{marginTop:'-.7rem', marginRight:'-.3rem'}}>
                <input 
                  type="checkbox" 
                  className="checkbox" 
                  id="checkbox" 
                  checked={isDarkMode} 
                  onChange={toggleDarkMode} 
                />
                <label htmlFor="checkbox" className="checkbox-labelmob" style={{display: router.pathname === '/register' || router.pathname === '/login' || router.pathname === '/' || router.pathname === '/bill/[id]' ? 'none' : 'block'}}>
                  <DarkModeIcon className="famoonmob"/>
                  <WbSunnyIcon className="fasunmob"/>
                  <span className="ball"></span>
                </label>
              </div>
              <button onClick={toggleFormVisibility} style={{ width:'2rem', height:'2rem', backgroundColor: '#1e40af', color: 'white', padding: '1px 1px 0 1px', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', marginRight:'3px', marginLeft:'15px', display: router.pathname === '/register' || router.pathname === '/login' || router.pathname === '/profile' || router.pathname === '/bill/[id]' ? 'none' : 'block', marginBottom:'.8rem'}}>
                    {isFormVisible ? <RemoveCircleIcon /> : <AddCircleIcon />}
                </button>
                <button style={{ backgroundColor: '#1e40af', color: 'white', padding: '1px 1px 0 1px', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', marginRight:'10px', marginLeft:'15px', display: router.pathname === '/profile' ? 'block' : 'none', marginBottom:'.8rem'}}>
                  {/* <Link href="/switchUserPage" style={{textDecoration:'none', color:'white'}}> */}
                  <CameraswitchIcon onClick={() => setShowSwitchModal(true)}/>
                  {/* </Link> */}
                </button>
              <IconButton className={styles.mobmenu} color="inherit" onClick={handleMenuToggle} style={{marginBottom:'.8rem'}}>
              {anchorEl ? <CloseIcon style={{ color: scrolling ? 'white' : 'black', fontSize:'2rem' }} /> : <MenuIcon style={{ color: scrolling ? 'white' : 'black', fontSize:'2rem' }} />}
              </IconButton>
              {anchorEl && (
                <div className={styles.mobileMenuContent}>
                  <ul className={styles.mobileMenuList}>
                    <li className={styles.mobileMenuItem}>
                      <Link href="/">
                        <div style={{display:'flex', flexDirection:'row', gap:'1rem'}}><HouseSidingIcon style={{color:'var(--shade7)', marginTop:'1rem'}}/><h4 className={styles.mobileMenuLink}>Home</h4></div>
                      </Link>
                    </li>
                    <li className={styles.mobileMenuItem}>
                      <Link href="/profile">
                      <div style={{display: router.pathname === '/register' || router.pathname === '/login' ? 'none' : 'flex', flexDirection:'row', gap:'1rem'}}><AccountBoxIcon style={{color:'var(--shade7)', marginTop:'1rem'}}/><h4 className={styles.mobileMenuLink}>Profile</h4></div>
                      </Link>
                    </li>
                    <li className={styles.mobileMenuItem}>
                      <Link href="/register">
                      <div style={{display:'flex', flexDirection:'row', gap:'1rem'}}><HowToRegIcon style={{color:'var(--shade7)', marginTop:'1rem'}}/><h4 className={styles.mobileMenuLink}>Register</h4></div>
                      </Link>
                    </li>
                    <li className={styles.mobileMenuItem}>
                      <Link href="/login">
                      <div style={{display:'flex', flexDirection:'row', gap:'1rem'}}><LoginIcon style={{color:'var(--shade7)', marginTop:'1rem'}}/><h4 className={styles.mobileMenuLink}>Login</h4></div>
                      </Link>
                    </li>
                    <li className={styles.mobileMenuItem}>
                      <Link href="https://pranav-programmer.github.io/Contact-Form/" target="_blank" rel="noopener noreferrer">
                      <div style={{display: router.pathname === '/register' || router.pathname === '/login' ? 'none' : 'flex', flexDirection:'row', gap:'1rem'}}><EmailIcon style={{color:'var(--shade7)', marginTop:'1rem'}}/><h4 className={styles.mobileMenuLink}>Contact</h4></div>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
