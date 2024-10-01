import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [splitWithUsername1, setSplitWithUsername1] = useState('');
  const [splitWithUsername2, setSplitWithUsername2] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, splitWithUsername1, splitWithUsername2 }),
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  return (
    <Layout>
      <Navbar />
      <div style={{
        fontFamily: 'Arial, sans-serif',
        margin: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '40vh',
        marginTop:'17rem',
        // background: 'linear-gradient(to right, #83a4d4, #2b59ee)',
      }}>
        <div style={{
          background: 'var(--shade2)',
          margin: '10px',
          padding: '50px',
          borderRadius: '20px',
          boxShadow: '8px 8px 8px 8px rgba(0,0,0,.2)',
          position:'absolute'
        }}>
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}>
            <label htmlFor="username" style={{
              fontSize: '24px',
              marginBottom: '10px',
              color: '#2b58ff',
            }}>SplitBill Register</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                height: '50px',
                marginBottom: '20px',
                fontSize: '24px',
                border: 'none',
                borderBottom: '2px solid #83a4d4',
                color: 'var(--fg)',
                borderRadius:'10px',
                paddingLeft:'20px',
                backgroundColor: 'var(--shade2)',
                outline: 'none',
              }}
              required
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                height: '50px',
                marginBottom: '20px',
                fontSize: '24px',
                border: 'none',
                borderBottom: '2px solid #83a4d4',
                color: 'var(--fg)',
                borderRadius:'10px',
                paddingLeft:'20px',
                backgroundColor: 'var(--shade2)',
                outline: 'none',
              }}
              required
            />
            <input
              type="text"
              id="splitWithUsername1"
              placeholder="Split Bill With (User1)"
              value={splitWithUsername1}
              onChange={(e) => setSplitWithUsername1(e.target.value)}
              style={{
                width: '100%',
                height: '50px',
                marginBottom: '20px',
                fontSize: '24px',
                border: 'none',
                borderBottom: '2px solid #83a4d4',
                color: 'var(--fg)',
                borderRadius:'10px',
                paddingLeft:'20px',
                backgroundColor: 'var(--shade2)',
                outline: 'none',
              }}
              required
            />
            <input
              type="text"
              id="splitWithUsername2"
              placeholder="Split Bill With (User2)"
              value={splitWithUsername2}
              onChange={(e) => setSplitWithUsername2(e.target.value)}
              style={{
                width: '100%',
                height: '50px',
                marginBottom: '20px',
                fontSize: '24px',
                border: 'none',
                borderBottom: '2px solid #83a4d4',
                color: 'var(--fg)',
                borderRadius:'10px',
                paddingLeft:'20px',
                backgroundColor: 'var(--shade2)',
                outline: 'none',
              }}
              required
            />
            <button
              type="submit"
              style={{
                width: '100%',
                height: '50px',
                fontSize: '24px',
                border: 'none',
                borderRadius: '10px',
                background: '#2b58ff',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Register
            </button>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '10px' }}>
              Please store your username and password securely, as you won&apos;t be able to recover them in the future.
            </p>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '10px' }}>
              Already have an account? <Link href="/login" style={{ color: '#2b58ff', textDecoration: 'none' }}>Login here</Link>
            </p>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </form>
        </div>
      </div>
    </Layout>
  );
}
