import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import styles from './index.module.css';
import "./app.css";
import LoadingSpinner from '../components/LoadingSpinner';
// import MobileNavigationMenu from '@/components/MobileNavigationMenu/MobileNavigationMenu'

export default function Home() {
  const [mainMeterReading, setMainMeterReading] = useState('');
  const [splitWithMeterReading, setSplitWithMeterReading] = useState('');
  const [equalReading, setEqualReading] = useState('');
  const [totalBillAmount, setTotalBillAmount] = useState('');
  const [date, setDate] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [splitWithUser1, setSplitWithUser1] = useState(null);
  const [splitWithUser2, setSplitWithUser2] = useState(null);
  const [previousDepositUser1, setPreviousDepositUser1] = useState(null);
  const [previousDepositUser2, setPreviousDepositUser2] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const userRes = await fetch('/api/get-current-user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userRes.ok) {
          router.push('/login');
          throw new Error('Failed to fetch user');
        }

        const userData = await userRes.json();
        setCurrentUser(userData.user);
        setSplitWithUser1(userData.user.splitWithUsername1 || '');
        setSplitWithUser2(userData.user.splitWithUsername2 || '');

        const billRes = await fetch('/api/get-bills', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!billRes.ok) {
          throw new Error('Failed to fetch bills');
        }

        const billData = await billRes.json();
        // Sort bills by date to ensure they are in the correct order
        billData.bills.sort((a, b) => new Date(b.date) - new Date(a.date));

        setBills(billData.bills);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/add-bill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        date,
        mainMeterReading,
        splitWithMeterReading,
        equalReading,
        totalBillAmount,
        splitWithUser1,
        splitWithUser2,
        previousDepositUser1, // New field
        previousDepositUser2, // New field
      }),
    });

    if (res.ok) {
      router.reload();
    } else {
      const errorData = await res.json();
      alert(`Failed to add bill: ${errorData.message}`);
    }
  };

  if (loading) {
    return (
      <Layout>
                <div style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center', marginTop:'23%', flexDirection:'column'}}><LoadingSpinner/><p style={{marginLeft:'.8rem'}}>Loading the home page, just a moment...</p></div>
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

  const calculateMonthlyReading = (current, previous) => current - (previous || 0);

  return (
    <Layout>
        <Navbar isFormVisible={isFormVisible} toggleFormVisibility={toggleFormVisibility} />
      {isFormVisible && (
        <form onSubmit={handleSubmit} style={{ maxWidth: '32rem', margin: '4.5rem auto 0 auto', backgroundColor: 'var(--shade1)', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '4px 4px 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', color: '#3b82f6' }}>Add Bill Details</h1>
          <div style={{ marginBottom: '1rem', paddingRight: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--shade10)' }}>Date</label>
            <input
              type="date"
              style={{ width: '100%', border: '2px solid #3b82f6', borderRadius: '0.5rem', padding: '0.5rem', backgroundColor:'var(--shade3)', color:'var(--fg)' }}
              value={date}  
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem', paddingRight: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--shade10)' }}>Main Meter Reading</label>
            <input
              type="number"
              style={{ width: '100%', border: '2px solid #3b82f6', borderRadius: '0.5rem', padding: '0.5rem', backgroundColor:'var(--shade3)', color:'var(--fg)' }}
              value={mainMeterReading}
              onChange={(e) => setMainMeterReading(e.target.value)}
              required
            />
          </div>
          {currentUser && (
            <div style={{ marginBottom: '1rem', paddingRight: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--shade10)' }}>
                {splitWithUser2} Meter Reading
              </label>
              <input
                type="number"
                style={{ width: '100%', border: '2px solid #3b82f6', borderRadius: '0.5rem', padding: '0.5rem', backgroundColor:'var(--shade3)', color:'var(--fg)' }}
                value={splitWithMeterReading}
                onChange={(e) => setSplitWithMeterReading(e.target.value)}
                required
              />
            </div>
          )}
          <div style={{ marginBottom: '1rem', paddingRight: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--shade10)' }}>Shared Meter Reading</label>
            <input
              type="number"
              style={{ width: '100%', border: '2px solid #3b82f6', borderRadius: '0.5rem', padding: '0.5rem', backgroundColor:'var(--shade3)', color:'var(--fg)' }}
              value={equalReading}
              onChange={(e) => setEqualReading(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem', paddingRight: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--shade10)' }}>Previous Deposit of {splitWithUser1}</label>
            <input
              type="number"
              style={{ width: '100%', border: '2px solid #3b82f6', borderRadius: '0.5rem', padding: '0.5rem', backgroundColor:'var(--shade3)', color:'var(--fg)' }}
              value={previousDepositUser1}
              onChange={(e) => setPreviousDepositUser1(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem', paddingRight: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--shade10)' }}>Previous Deposit of {splitWithUser2}</label>
            <input
              type="number"
              style={{ width: '100%', border: '2px solid #3b82f6', borderRadius: '0.5rem', padding: '0.5rem', backgroundColor:'var(--shade3)', color:'var(--fg)' }}
              value={previousDepositUser2}
              onChange={(e) => setPreviousDepositUser2(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem', paddingRight: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--shade10)' }}>Total Bill Amount</label>
            <input
              type="number"
              style={{ width: '100%', border: '2px solid #3b82f6', borderRadius: '0.5rem', padding: '0.5rem', backgroundColor:'var(--shade3)', color:'var(--fg)' }}
              value={totalBillAmount}
              onChange={(e) => setTotalBillAmount(e.target.value)}
              placeholder='Amount is editable in bill section'
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button type="submit" style={{ backgroundColor: '#3b82f6', color: 'var(--shade10)', padding: '0.5rem 1rem', borderRadius: '0.5rem', transition: 'background-color 0.3s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#1e40af'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#3b82f6'}>
            Add Bill
          </button>
          </div>
        </form>
      )}
<h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginTop: isFormVisible? '2rem' : '4.5rem', marginBottom: '-.5rem', textAlign: 'center', color: '#3b82f6' }}>{bills.length === 0 ? ("Add your first bill record"):("Previous Bills")}</h2>
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <div className={styles.card_gap} style={{ display: 'grid', width: '95%', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {bills.length > 0 && (
            bills.map((bill, index) => {
              const previousBill = index >= 0 ? bills[index + 1] : null;
              const previousMainMeterReading = previousBill ? previousBill.mainMeterReading : 0;
              const monthlyMainMeterReading = calculateMonthlyReading(bill.mainMeterReading, previousMainMeterReading);
              const ratePerUnit = (bill.totalBillAmount / monthlyMainMeterReading).toFixed(2);

              return (
                <Link key={bill._id} href={`/bill/${bill._id}`} style={{ textDecoration: 'none', color:'black' }}>
                  <li className={styles.cards_item}>
                    <div className={styles.card}>
                      <div className={styles.card_content}>
                        <h2 className={styles.card_title} style={{margin:' 1.2rem 0', fontSize:'1.3em'}}>Bill Details</h2>
                        <div className={styles.card_text}>
                          <p>Date: {new Date(bill.date).toLocaleDateString()}</p>
                          <p>Consumption: {monthlyMainMeterReading} units</p>
                          <p>Rate per Unit: {monthlyMainMeterReading === 0 ? ("N/A") : ("₹ " + ratePerUnit)}</p>
                          <p>Bill Amount: ₹ {bill.totalBillAmount}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                </Link>
              );
            })
          )}
        </div>
      </div>
      {/* <MobileNavigationMenu/> */}
    </Layout>
  );
}
