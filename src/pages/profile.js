import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import ElectricityConsumption from './electricity-consumption';
import SwitchUser from '@/components/SwitchUser';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditing1, setIsEditing1] = useState(false);
  const [isEditing2, setIsEditing2] = useState(false);
  const [updatedUsername, setUpdatedUsername] = useState('');
  const [updatedPrimaryUsername, setUpdatedPrimaryUsername] = useState('');
  const [updatedSecondaryUsername, setUpdatedSecondaryUsername] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [storedUsers, setStoredUsers] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('storedUsers')) || [];
    setStoredUsers(users);
  }, []);

  useEffect(() => {
    const fetchUserAndBills = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const userRes = await fetch('/api/get-profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userRes.ok) {
          router.push('/login');
          return;
        }

        const userData = await userRes.json();
        setUser(userData.user);

        const billsRes = await fetch('/api/get-bills', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!billsRes.ok) {
          const billData = await billsRes.json();
          throw new Error(billData.message);
        }

        const billsData = await billsRes.json();
        setBills(billsData.bills);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBills();
  }, [router]);

  const handleLogout = async () => {
    const res = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const updatedUsers = storedUsers.filter(storedUser => storedUser.username !== user.username);
      localStorage.setItem('storedUsers', JSON.stringify(updatedUsers));

      localStorage.removeItem('token');
      router.push('/login');
    }  else {
      alert('Logout failed');
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
      const updatedUsers = storedUsers.filter(storedUser => storedUser.username !== user.username);
      localStorage.setItem('storedUsers', JSON.stringify(updatedUsers));

        localStorage.removeItem('token');
        router.push('/login');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdatedUsername(user.username);
  };

  const handleEditClick1 = () => {
    setIsEditing1(true);
    setUpdatedPrimaryUsername(user.splitWithUsername1);
  };

  const handleEditClick2 = () => {
    setIsEditing2(true);
    setUpdatedSecondaryUsername(user.splitWithUsername2);
  };

  const handleSaveClick = async () => {
    const token = localStorage.getItem('token');
    const finalUpdatedUsername = updatedUsername || user.username;
    const finalUpdatedPrimaryUsername = updatedPrimaryUsername || user.splitWithUsername1;
    const finalUpdatedSecondaryUsername = updatedSecondaryUsername || user.splitWithUsername2;

    try {
      const res = await fetch('/api/update-usernames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          primaryUsername: finalUpdatedUsername,
          secondaryUsername1: finalUpdatedPrimaryUsername,
          secondaryUsername2: finalUpdatedSecondaryUsername,
        }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser.user);
        setIsEditing(false);
        setIsEditing1(false);
        setIsEditing2(false);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleModalConfirm = () => {
    setShowDeleteModal(false);
    handleDeleteAccount();
  };

  if (loading) {
    return (
      <Layout>
        <div style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center', marginTop:'23%', flexDirection:'column'}}><LoadingSpinner/><p style={{marginLeft:'.8rem'}}>Loading your profile, please wait...</p></div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <p>Error: {error}</p>
      </Layout>
    );
  }

  const mround = (value, multiple) => {
    return Math.round(value / multiple) * multiple;
  };

  
        
  bills.sort((a, b) => new Date(a.date) - new Date(b.date));

   // Calculating the required values
   const oldestBillMainMeterReading = bills.length > 0 ? bills[0].mainMeterReading : 0;
   const oldestBillAmount = bills.length > 0 ? bills[0].totalBillAmount : 0;
  
   const totalUnits = bills.reduce((sum, bill) => bill.mainMeterReading, 0) - oldestBillMainMeterReading;
   const totalSplitWithUnits = bills.reduce((sum, bill) => bill.splitWithMeterReading, 0);
   const totalEqualUnits = bills.reduce((sum, bill) => bill.equalReading, 0);
   const totalBillAmount = bills.reduce((sum, bill) => sum + bill.totalBillAmount, 0) - oldestBillAmount;
   const averageRatePerUnit = totalBillAmount / totalUnits;
 
   const totalPrimaryUserUnits = totalUnits - totalSplitWithUnits - totalEqualUnits;
   const totalSecondaryUserUnits = totalSplitWithUnits;
   const totalPrimaryUserBillAmount = totalBillAmount - (totalSecondaryUserUnits * averageRatePerUnit) - ((totalEqualUnits / 2) * averageRatePerUnit);
   const roundedTotalPrimaryUserBillAmount = mround(totalPrimaryUserBillAmount, 10);
   const totalSecondaryUserBillAmount = (totalSecondaryUserUnits * averageRatePerUnit) + ((totalEqualUnits / 2) * averageRatePerUnit);
   const roundedTotalSecondaryUserBillAmount = mround(totalSecondaryUserBillAmount, 10);

  return (
    <Layout >
      <Navbar setShowSwitchModal={setShowSwitchModal} />
      <div style={{
        Width: '100%',
        maxWidth: '73rem',
        margin: '5rem auto 0 auto',
        backgroundColor: 'var(--shade3)',
        padding: '1.5rem 1.5rem 1.9rem 1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '10px 10px 10px 15px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {(isEditing || isEditing1 || isEditing2) ? (
              <div style={{display:'flex', flexDirection:'column'}}>
              <div>
                {isEditing && (
                  <input
                    type="text"
                    value={updatedUsername}
                    onChange={(e) => setUpdatedUsername(e.target.value)}
                    style={{ backgroundColor:'var(--shade2)', fontSize: '1rem', fontWeight: '600', color: 'var(--fg)', marginRight: '1rem' }}
                  />
                )}
                {isEditing1 && (
                  <input
                    type="text"
                    value={updatedPrimaryUsername}
                    onChange={(e) => setUpdatedPrimaryUsername(e.target.value)}
                    style={{ backgroundColor:'var(--shade2)', fontSize: '1rem', fontWeight: '600', color: 'var(--fg)', marginRight: '1rem'}}
                  />
                )}
                {isEditing2 && (
                  <input
                    type="text"
                    value={updatedSecondaryUsername}
                    onChange={(e) => setUpdatedSecondaryUsername(e.target.value)}
                    style={{ backgroundColor:'var(--shade2)', fontSize: '1rem', fontWeight: '600', color: 'var(--fg)' }}
                  />
                )}
                </div>
                <button onClick={handleSaveClick} style={{ color: 'var(--fg)', backgroundColor:'var(--shade2)', padding:'.2rem', fontSize:'1rem', marginBottom:'.2rem', width:'30%', marginLeft:'30%', marginTop:'1rem'}}>Save</button>
              </div>
            ) : (
              <>
                <div>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fg)' }}>Owner: {user.username}</p>
                    <BorderColorOutlinedIcon onClick={handleEditClick} style={{ fontSize: '1.3rem', cursor: 'pointer', marginTop: '1rem' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fg)' }}>Primary User: {user.splitWithUsername1}</p>
                    <BorderColorOutlinedIcon onClick={handleEditClick1} style={{ fontSize: '1.3rem', cursor: 'pointer', marginTop: '1rem' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--fg)' }}>Secondary User: {user.splitWithUsername2}</p>
                    <BorderColorOutlinedIcon onClick={handleEditClick2} style={{ fontSize: '1.3rem', cursor: 'pointer', marginTop: '1rem' }} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#3b82f6',
            marginBottom: '1rem'
          }}>Electricity Usage Summary</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Metric</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Total electricity unit consumption</td>
                {bills.length>0 ? (<td style={{ border: '1px solid #ddd', padding: '8px', textAlign:'center' }}>{totalUnits}</td>) : 
                (<td style={{ border: '1px solid #ddd', padding: '8px', textAlign:'center'}}>N/A</td>)}
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Total electricity unit consumption by {user.splitWithUsername1}</td>
                {bills.length>0 ? (<td style={{ border: '1px solid #ddd', padding: '8px', textAlign:'center' }}>{totalPrimaryUserUnits}</td>) : 
                (<td style={{ border: '1px solid #ddd', padding: '8px', textAlign:'center' }}>N/A</td>)}
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Total electricity unit consumption by {user.splitWithUsername2}</td>
                {bills.length>0 ? (<td style={{ border: '1px solid #ddd', padding: '8px', textAlign:'center' }}>{totalSecondaryUserUnits}</td>) : 
                (<td style={{ border: '1px solid #ddd', padding: '8px', textAlign:'center' }}>N/A</td>)}
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Total shared electricity unit consumption</td>
                {bills.length>0 ? (<td style={{ border: '1px solid #ddd', padding: '8px', textAlign:'center' }}>{totalEqualUnits}</td>) : 
                (<td style={{ border: '1px solid #ddd', padding: '8px', textAlign:'center' }}>N/A</td>)}
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Total bill amount</td>
                {bills.length>0 ? (<td style={{ border: '1px solid #ddd', padding: '8px', textAlign:'center' }}>{totalBillAmount}</td>) : 
                (<td style={{ border: '1px solid #ddd', padding: '8px', textAlign:'center' }}>N/A</td>)}
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Total bill amount for {user.splitWithUsername1}</td>
                {bills.length>0 ? (<td style={{ border: '1px solid #ddd', padding: '8px', textAlign:'center' }}>{roundedTotalPrimaryUserBillAmount}</td>) : 
                (<td style={{ border: '1px solid #ddd', padding: '8px', textAlign:'center' }}>N/A</td>)}
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Total bill amount for {user.splitWithUsername2}</td>
                {bills.length>0 ? (<td style={{ border: '1px solid #ddd', padding: '8px', textAlign:'center' }}>{roundedTotalSecondaryUserBillAmount}</td>) : 
                (<td style={{ border: '1px solid #ddd', padding: '8px', textAlign:'center' }}>N/A</td>)}
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Average rate per unit</td>
                {bills.length>0 ? (<td style={{ border: '1px solid #ddd', padding: '8px', textAlign:'center' }}>{averageRatePerUnit.toFixed(2)}</td>) : 
                (<td style={{ border: '1px solid #ddd', padding: '8px', textAlign:'center' }}>N/A</td>)}
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
          {totalUnits>0 ? (<ElectricityConsumption updatedPrimaryUsername={user.splitWithUsername1} updatedSecondaryUsername={user.splitWithUsername2} />) : 
          (<h3>Add your first bill record</h3>)}
        </div>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', gap:'1rem', margig:'1rem'}}>
        <button
          onClick={handleLogout}
          style={{
            display: 'block',
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: 'white',
            backgroundColor: 'gray',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            textAlign: 'center',
            marginTop: '1rem',
          }}
        >
          Logout
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          style={{
            display: 'block',
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: 'white',
            backgroundColor: '#EF4444',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            textAlign: 'center',
            marginTop: '1rem',
          }}
        >
          Delete Account
        </button>
        </div>
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
             <span style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '1rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              marginTop: '-1.7rem',
              marginBottom: '-1rem',
            }}>
        <svg style={{ fill: 'currentColor', width: '2rem', height: '2rem' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z"/>
        </svg>
      </span>
              <h2>Confirm Account Deletion</h2>
              <p>Are you sure you want to delete your account? You won&apos;t be able to retrieve any data once deleted.</p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: '1rem'
              }}>
                <button onClick={() => setShowDeleteModal(false)} style={{
                  backgroundColor: 'gray',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}>Cancel</button>
                <button onClick={handleModalConfirm} style={{
                  backgroundColor: '#EF4444',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}>Delete</button>
              </div>
            </div>
          </div>
        )}
        {showSwitchModal && (
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
              <SwitchUser setShowSwitchModal={setShowSwitchModal} currentLoggedUser = {user.username}/>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
