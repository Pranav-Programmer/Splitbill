import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { encrypt, decrypt } from '../utils';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [storedUsers, setStoredUsers] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('storedUsers')) || [];
    setStoredUsers(users);
  }, []);

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);

      if (rememberMe) {
        let users = JSON.parse(localStorage.getItem('storedUsers')) || [];
        const existingUserIndex = users.findIndex(user => user.username === username);

        const encryptedPassword = encrypt(password);

        if (existingUserIndex > -1) {
          users[existingUserIndex] = { username, password: encryptedPassword };
        } else {
          users.push({ username, password: encryptedPassword });
        }

        localStorage.setItem('storedUsers', JSON.stringify(users));
        setStoredUsers(users);
      }
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  const handleRegisterClick = () => {
    router.push('/register');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleUserSwitch = (e) => {
    const selectedUser = storedUsers.find(user => user.username === e.target.value);
    if (selectedUser) {
      const decryptedPassword = decrypt(selectedUser.password);
      setUsername(selectedUser.username);
      setPassword(decryptedPassword);
      setRememberMe(true);
    }
  };

  return (
    <Layout>
      <Navbar />
      <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'15rem'}}>
        <div style={{ background: 'var(--shade2)', margin: '10px', padding: '50px', borderRadius: '20px', boxShadow: '8px 8px 8px 8px rgba(0,0,0,.2)',position:'absolute'}}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', maxWidth:'40rem', margin: '.3rem auto 0 auto', padding:'.1rem'}}>
            <label htmlFor="login" style={{ fontSize: '24px', marginBottom: '10px', color: '#2b58ff' }}>SplitBill Login</label>
            {/* {storedUsers && (
              <div style={{ marginTop: '10px', marginBottom:'20px'}}>
                <label htmlFor="userSwitch" style={{ fontSize: '18px', color: '#888' }}>Select User:</label>
                <select id="userSwitch" onChange={handleUserSwitch} style={{ fontSize: '18px', marginLeft: '10px', cursor:'pointer', background:'var(--shade2)', color:'var(--fg)'}}>
                  <option value="" style={{textAlign:'center',}}>- - - - - - - -</option>
                  {storedUsers.map((user, index) => (
                    <option key={index} value={user.username}>{user.username}</option>
                  ))}
                </select>
              </div>
            )} */}
            <input
              type="text"
              id="login"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ background:'var(--shade2)', width: '100%', height: '50px', marginBottom: '20px', fontSize: '24px', border: 'none', borderBottom: '2px solid #83a4d4', color: 'var(--fg)', outline: 'none', paddingLeft:'20px', borderRadius:'10px' }}
              required
            />
            <div style={{ display: 'flex', alignItems: 'center', width: '102%', marginBottom: '20px' }}>
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ background:'var(--shade2)', width: '100%', height: '50px', fontSize: '24px', border: 'none', borderBottom: '2px solid #83a4d4', color: 'var(--fg)', outline: 'none', paddingLeft:'20px', borderRadius:'10px' }}
                required
              />
              {/* <button type="button" onClick={togglePasswordVisibility} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '-40px' }}>
                {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button> */}
            </div>
            <label style={{ fontSize: '18px', marginBottom: '10px', color: '#888' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleCheckboxChange}
                style={{ marginRight: '10px' }}
              />
              Remember me
            </label>
            <button type="submit" style={{ width: '100%', height: '50px', fontSize: '24px', border: 'none', borderRadius: '10px', background: '#2b58ff', color: 'var(--fg)', cursor: 'pointer' }}>
              Submit
            </button>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '10px' }}>
              Please check Remember me box to save user details to switch user without re-entering credentials.
            </p>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#888', textAlign: 'center' }}>
              Don&apos;t have an account? <span style={{ cursor: 'pointer', color: '#2b58ff' }} onClick={handleRegisterClick}>Register here</span>
            </p>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </form>
        </div>
      </div>
    </Layout>
  );
}
