import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from './Layout';
import Navbar from './Navbar';
import { encrypt, decrypt } from '@/utils';

const SwitchUser = ({setShowSwitchModal, currentLoggedUser}) => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [storedUsers, setStoredUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('storedUsers')) || [];
    const filteredUsers = users.filter(user => user.username !== currentLoggedUser);
    setStoredUsers(filteredUsers);
  }, [currentLoggedUser]);

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleUserSwitch = (username) => {
    setShowDeleteModal(true);
    const selectedUser = storedUsers.find(user => user.username === username);
    if (selectedUser) {
      const decryptedPassword = decrypt(selectedUser.password);
      setUsername(selectedUser.username);
      setPassword(decryptedPassword);
      setRememberMe(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    handleUserSwitch(username);

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

      router.push('/profile');
      window.location.reload();
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
  
  const handleModalConfirm = () => {
    setShowDeleteModal(false)
  };

  return (
    <Layout>
      <div style={{marginBottom:'18%'}}>
        <div>
          <div style={{ background: 'var(--shade2)', margin:'-15% -15% -35% -15%', padding: '50px', borderRadius: '20px' }}>
            {storedUsers.length > 0 ? (
              <div style={{ marginTop: '10px', marginBottom: '10px', width: '100%' }}>
                <div id="userSwitch" style={{ marginTop: '10px' }}>
                  {storedUsers.map((user, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '28px', color: 'var(--fg)' }}>{user.username}</span>
                      <button
                        type="button"
                        onClick={() => handleUserSwitch(user.username)}
                        style={{ background: '#2b58ff', fontSize: '14px',color: 'var(--fg)', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', marginTop:'.3rem' }}
                      >
                        Switch
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (<h4 style={{textAlign:'justify'}}>You logged in with only one account, to switch account please logged in with more than one account and please check Remember me box to save user details for switch</h4>)}
            <button style={{
              display: 'block',
              width: '100%',
              padding: '0.75rem',
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'white',
              backgroundColor: 'gray',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              textAlign: 'center',
              marginTop: '1.8rem',
            }} onClick={() => setShowSwitchModal(false)}>
              Cancel
            </button>
            {showDeleteModal && (
              <div style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
              }}>
                <div style={{
                  backgroundColor: 'var(--shade2)',
                  padding: '2rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  width: '70%',
                  maxWidth: '500px',
                  textAlign: 'center'
                }}>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <label htmlFor="login" style={{ fontSize: '22px', marginBottom: '10px', color: 'var(--fg)' }}>Do you want switch to <p style={{fontWeight:'bolder', display:'inline'}}>{username}</p> account?</label>
                    <input
                      type="text"
                      id="login"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={{ display:'none', background: 'var(--shade2)', width: '100%', height: '50px', marginBottom: '20px', fontSize: '24px', border: 'none', borderBottom: '2px solid #83a4d4', color: 'var(--fg)', outline: 'none', paddingLeft: '20px', borderRadius: '10px' }}
                      required
                    />
                    <div style={{ display: 'none', alignItems: 'center', width: '102%', marginBottom: '20px' }}>
                      <input
                        type={passwordVisible ? 'text' : 'password'}
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ background: 'var(--shade2)', width: '100%', height: '50px', fontSize: '24px', border: 'none', borderBottom: '2px solid #83a4d4', color: 'var(--fg)', outline: 'none', paddingLeft: '20px', borderRadius: '10px' }}
                        required
                      />
                    </div>
                    <div style={{display:'flex', flexDirection:'row', gap:'20px'}}>
                      <button type="submit" style={{ width: '8rem', height: '3rem', fontSize: '19px', border: 'none', borderRadius: '10px', background: '#2b58ff', color: 'var(--fg)', cursor: 'pointer' }}>
                        Switch
                      </button>
                      <button onClick={() => setShowDeleteModal(false)} style={{ width: '8rem', height: '3rem', fontSize: '19px', border: 'none', borderRadius: '10px', background: '#2b58ff', color: 'var(--fg)', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                    {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SwitchUser;
