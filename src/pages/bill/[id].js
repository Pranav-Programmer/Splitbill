import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Layout from '../../components/Layout';
import Navbar from '@/components/Navbar';
import styles from './bill.module.css';
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import downloadjs from 'downloadjs';
import html2canvas from 'html2canvas';
import CountUp from 'react-countup';
import LoadingSpinner from '../../components/LoadingSpinner';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { jsPDF } from 'jspdf';

const DisplayDecimal = ({ value }) => {
  const decimalPart = (value % 1).toFixed(2).split('.')[1];
  return <span>.{decimalPart}</span>;
};

export default function BillDetails() {
  const router = useRouter();
  const [isHidden, setIsHidden] = useState(false);
  const { id } = router.query;
  const [bill, setBill] = useState(null);
  const [previousBill, setPreviousBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [editedTotalBillAmount, setEditedTotalBillAmount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [previousDepositUser1, setPreviousDepositUser1] = useState(0);
  const [previousDepositUser2, setPreviousDepositUser2] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [buttonTextUser1, setButtonTextUser1] = useState('Delete Bill');
  const [buttonTextUser2, setButtonTextUser2] = useState('Save Change');

  const contentRef = useRef(null);

  const handleZoomIn = () => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 0.1, 1.1)); // Limiting zoom in to 1.1x
  };

  const handleZoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 0.1, 0.5)); // Limiting zoom out to 0.5x
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleNavigationBack = () => {
    router.back(); // This will navigate back to the previous page
  };

  useEffect(() => {
    const updateVisibility = () => {
      setIsHidden(window.innerWidth < 520);
    };

    // Set initial visibility based on the current window size
    updateVisibility();

    // Add an event listener to handle window resize
    window.addEventListener('resize', updateVisibility);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', updateVisibility);
  }, []);

  useEffect(() => {
    if (id) {
      const fetchBillData = async () => {
        const token = localStorage.getItem('token');
        try {
          const res = await fetch(`/api/get-bill/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const billData = await res.json();
          if (!res.ok) throw new Error(billData.message);

          setBill(billData.bill);
          setEditedTotalBillAmount(billData.bill.totalBillAmount);
          setPreviousDepositUser1(billData.bill.previousDepositUser1 || 0);
          setPreviousDepositUser2(billData.bill.previousDepositUser2 || 0);

          const billDate = billData.bill.date;
          const previousRes = await fetch(`/api/get-previous-bill?billDate=${billDate}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const previousBillData = await previousRes.json();
          if (!previousRes.ok) throw new Error(previousBillData.message);

          setPreviousBill(previousBillData.bill);

        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBillData();
    }
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/get-profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/delete-bill/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/update-bill/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ totalBillAmount: editedTotalBillAmount }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      const updatedBill = await res.json();
      setBill(updatedBill.bill);

    } catch (error) {
      setError(error.message);
    }
  };

  const handleDownload = async () => {
    const content = contentRef.current;
    if (!content) return;

     // Update button texts with split amounts
  setButtonTextUser1(
    <CountUp className={styles.valBtn} end={netAmountUser1} duration={0} prefix="₹ " />
  );
  setButtonTextUser2(
    <CountUp className={styles.valBtn} end={netAmountUser2} duration={0} prefix="₹ " />
  );

  await new Promise((resolve) => setTimeout(resolve, 100));

    content.classList.add(styles.hideButtons);
    setButtonTextUser1('Delete Bill');
    setButtonTextUser2('Save Change');
    content.classList.remove(styles.changeButtonText);
    content.classList.add(styles.containerVar);
    content.classList.add(styles.showDiv);
    content.classList.add(styles.tableDown);
    content.classList.add(styles.priceVar);
    content.classList.add(styles.metricVar);
    content.classList.add(styles.blockVar);
    content.classList.add(styles.billAmountVar);
  
    // Convert HTML content to canvas
    const canvas = await html2canvas(content, {
      scale: 2, // You can adjust the scale for better quality (higher scale) or smaller size (lower scale)
      useCORS: true, // Enables cross-origin images
  });
    const imgData = canvas.toDataURL('image/png', 0.7);
  
    // Get the dimensions of the canvas
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
  
    // Initialize jsPDF with the same aspect ratio as the image
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [imgWidth, imgHeight], // Use the image's dimensions for the PDF page size
    });
  
    // Add the image to the PDF
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST'); // 'FAST' reduces the file size
  
    // Save the PDF
    pdf.save( `${formattedDate} Bill Split.pdf`);

    content.classList.remove(styles.hideButtons);
    content.classList.remove(styles.changeButtonText);
    content.classList.remove(styles.showDiv);
    content.classList.remove(styles.priceVar);
    content.classList.remove(styles.metricVar);
    content.classList.remove(styles.blockVar);
    content.classList.remove(styles.billAmountVar);  
    content.classList.remove(styles.tableDown);
    content.classList.add(styles.table);
    content.classList.remove(styles.containerVar);
  };
  
  

  if (loading) {
    return (
      <Layout>
        <div style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center', marginTop:'23%', flexDirection:'column'}}><LoadingSpinner/><p style={{marginLeft:'.8rem'}}>Fetching your bill details, please hold on...</p></div>
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

  if (!bill) {
    return (
      <Layout>
        <p>Bill not found</p>
      </Layout>
    );
  }

  const mround = (value, multiple) => {
    return Math.round(value / multiple) * multiple;
  };

  // Assuming previousBill.mainMeterReading exists, otherwise set it to 0
  const previousMainMeterReading = previousBill ? previousBill.mainMeterReading : 0;
  const previousSplitWithMeterReading = previousBill ? previousBill.splitWithMeterReading : 0;
  const previousEqualReading = previousBill ? previousBill.equalReading : 0;

  const currentMainMeterReading = bill.mainMeterReading;
  const currentSplitWithMeterReading = bill.splitWithMeterReading;
  const currentEqualReading = bill.equalReading;

  const monthlyMainMeterReading = previousBill ? currentMainMeterReading - previousMainMeterReading : 0;
  const monthlySplitWithMeterReading = previousBill ? currentSplitWithMeterReading - previousSplitWithMeterReading : 0;
  const monthlyEqualReading = previousBill ? currentEqualReading - previousEqualReading : 0;
  const ratePerUnit = previousBill ? bill.totalBillAmount / monthlyMainMeterReading : 0;

  const primaryUserUsage = previousBill ? monthlyMainMeterReading - monthlySplitWithMeterReading - (0.5 * monthlyEqualReading) : 0;
  const secondaryUserUsage =previousBill ?  monthlySplitWithMeterReading + (0.5 * monthlyEqualReading) : 0;

  const primaryUserAmount = previousBill ? primaryUserUsage * ratePerUnit : 0;
  const secondaryUserAmount = previousBill ? secondaryUserUsage * ratePerUnit : 0;

  const roundedPrimaryUserAmount = mround(primaryUserAmount, 10);
  const roundedSecondaryUserAmount = mround(secondaryUserAmount, 10);

  // Calculate net amounts after subtracting previous deposits
  const netAmountUser1 = roundedPrimaryUserAmount - previousDepositUser1;
  const netAmountUser2 = roundedSecondaryUserAmount - previousDepositUser2;

  //change the color of the text based on the value of previousDepositUser1 and previousDepositUser2
  const colorUser1 = previousDepositUser1 > 0 ? 'green' : previousDepositUser1 < 0 ? 'red' : 'white';
  const colorUser2 = previousDepositUser2 > 0 ? 'green' : previousDepositUser2 < 0 ? 'red' : 'white';

  const startValue = previousMainMeterReading >= 500 ? previousMainMeterReading - 500 : 0;

  const formattedDate = new Date(bill.date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Layout>
      <Navbar/>
      <ReplyAllIcon style={{ display: isHidden ? 'none' : 'inline-block', marginBottom:'-1rem', cursor:'pointer'}} onClick={handleNavigationBack}/>
      <div className="container" id="bill-details" style={{ marginTop: '1rem' }}>
      <div className="container" id="bill-details" style={{ marginTop: '1rem' }}>
        <div style={{
          padding: '.5rem',
          gap: '1rem',
          position: 'fixed',
          bottom: '2px',
          right: '3px',
          zIndex: '100',
          display: 'flex',
          flexDirection: 'row',
          background:'var(--shade2)',
          borderRadius: '10px'
        }}>
           <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '.5rem',
            gap: '1rem',
            width: '100%',
            border: 'solid 1px var(--shade6)',
            borderRadius: '5px',
            background: 'var(--shade12)',
            color: 'var(--fg)',
            borderRadius: '5px',
            borderRadius: '10px'
          }}>
            <ZoomInIcon style={{ fontSize: '1.4rem', fontWeight: 'bold' }} onClick={handleZoomIn} />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '.5rem',
            gap: '1rem',
            width: '100%',
            border: 'solid 1px var(--shade6)',
            borderRadius: '5px',
            background: 'var(--shade12)',
            color: 'var(--fg)',
            borderRadius: '5px',
            borderRadius: '10px'
          }}>
            <ZoomOutIcon style={{ fontSize: '1.4rem', fontWeight: 'bold' }} onClick={handleZoomOut} />
          </div>
        </div>
      </div>
        <div className={styles.table} ref={contentRef} style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}>
          <div className={styles.headingContainer}>
            <h3 style={{ marginTop: '-.6rem' }} className={styles.heading}>
              <div className={styles.logo}>SplitBill</div>
              <button
                onClick={handleDownload}
                style={{ marginLeft: '1rem', cursor: 'pointer', border: 'none', background: 'none' }}
                className={styles.downloadButton}
              >
                <DownloadIcon className={styles.downloadButton} style={{ marginBottom: '-1.5rem', color:'var(--fg)' }} />
              </button>
            </h3>
            <span style={{ marginTop: '1rem' }} className={styles.date}>
              {formattedDate}
            </span>
          </div>
          {previousMainMeterReading >= 0 ? (" ") : (<h4 style={{color:'var(--shade5)', textAlign:'center', marginTop:'.1rem'}}>Please check your last month readings</h4>)}
          <div className={styles.block}>
            <p className={styles.metric}>
              Previous Month&apos;s Reading
              {previousMainMeterReading >=0  ? (<span className={styles.price}><CountUp start={startValue} end={previousMainMeterReading} duration={1} suffix=" units" /></span>) :
              (<span className={styles.price}>N/A</span>)}
            </p>
          </div>
          <div className={styles.block}>
            <p className={styles.metric}>
              Current Month&apos;s Reading
              <span className={styles.price}><CountUp start={previousMainMeterReading} end={currentMainMeterReading} duration={2} suffix=" units" /></span>
            </p>
          </div>
          <div className={styles.block}>
            <p className={styles.metric}>
              {bill.splitWithUser2} Meter Reading
              <span className={styles.price}><CountUp end={currentSplitWithMeterReading} duration={2} suffix=" units" /></span>
            </p>
          </div>
          <div className={styles.block}>
            <p className={styles.metric}>
              Shared Meter Reading
              <span className={styles.price}><CountUp end={currentEqualReading} duration={2} suffix=" units" /></span>
            </p>
          </div>
          <div className={styles.block}>
            <p className={styles.metric}>
              Current Month&apos;s Usage
              {monthlyMainMeterReading ? (<span className={styles.price}><CountUp end={monthlyMainMeterReading} duration={3} suffix=" units" /></span>) : 
              (<span className={styles.price}>N/A</span>)}
            </p>
          </div>
          <div className={styles.block}>
            <p className={styles.metric}>
              {bill.splitWithUser1} Electricity Usage
              {primaryUserUsage ? (<span className={styles.price}><CountUp end={primaryUserUsage - 0.5 * monthlyEqualReading} duration={3} suffix=" units" /></span>) :
              (<span className={styles.price}>N/A</span>)}
            </p>
          </div>
          <div className={styles.block}>
            <p className={styles.metric}>
              {bill.splitWithUser2} Electricity Usage
              {secondaryUserUsage ? (<span className={styles.price}><CountUp end={secondaryUserUsage - 0.5 * monthlyEqualReading} duration={3} suffix=" units" /></span>) : 
              (<span className={styles.price}>N/A</span>)}
            </p>
          </div>
          <div className={styles.block}>
            <p className={styles.metric}>
              Shared Electricity Usage
              {monthlyEqualReading ? (<span className={styles.price}><CountUp end={monthlyEqualReading} duration={3} suffix=" units" /></span>) :
              (<span className={styles.price}>N/A</span>)}
            </p>
          </div>
          <div className={styles.block}>
            <p className={styles.metric}>
              Rate per Unit
              {ratePerUnit ? (<span className={styles.price}><CountUp end={Math.floor(ratePerUnit)} duration={3} prefix="₹ " /><DisplayDecimal value={ratePerUnit} /></span>) :
              (<span className={styles.price}>N/A</span>)}
            </p>
          </div>
          <div className={styles.block}>
      <div className={styles.metric} style={{paddingBottom:'5px'}}>
        <p style={{marginTop:'0'}}>
        Total Bill Amount
        </p>
        <span className={styles.price} style={{ fontSize: '1.3rem', color: 'var(--fg)'}}>
        {isEditing && (<CurrencyRupeeOutlinedIcon style={{ verticalAlign: 'middle'}} />)}
          {isEditing ? (
            <input
              className={styles.innerBlock}
              type="number"
              value={editedTotalBillAmount}
              onChange={(e) => setEditedTotalBillAmount(Number(e.target.value))}
              onBlur={handleInputBlur}
              style={{ fontWeight: 'bold', fontSize: '1.3rem', width: '4rem', border: 'none', outline: 'none', marginRight: '-.1rem', background:'var(--shade2)', color:'var(--fg)' }}
              autoFocus
            />
          ) : (
            <span onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
              <CountUp className={styles.billAmount} style={{ fontWeight: 'bold', fontSize: '1.3rem' }} end={editedTotalBillAmount} duration={3} prefix="₹ " />
            </span>
          )}
        </span>
      </div>
    </div>
          <div className={styles.block}>
            <p className={styles.metric}>
              {bill.splitWithUser1} Bill Amount
              {roundedPrimaryUserAmount ? (<span className={styles.price} style={{ fontSize: '1.3rem', color: 'var(--shade1)', fontWeight: 'bold' }}>
                <CountUp className={styles.billAmount} end={roundedPrimaryUserAmount} duration={3} prefix="₹ " />
              </span>) :
              (<span style={{ fontSize: '1.3rem', color: 'var(--fg)', fontWeight: 'bold' }} className={styles.price}>N/A</span>)}
            </p>
          </div>
          <div className={styles.block}>
          <div className={styles.metric} style={{paddingBottom:'5px'}}>
          <p style={{marginTop:'0'}}>
            {bill.splitWithUser1} Previous Deposit
          </p>
            <span
              className={styles.price}
              style={{
                color: colorUser1 === 'green' ? '#009E60' : colorUser1 === 'red' ? 'red' : 'var(--fg)',
                fontSize: '1.3rem',
                fontWeight: 'bold',
              }}
            >
              <CountUp end={previousDepositUser1} duration={3} prefix=" ₹ " />
            </span>
          </div>
          </div>
          <div className={styles.block}>
          <div className={styles.metric} style={{paddingBottom:'5px'}}>
            <p style={{marginTop:'0'}}>
              {bill.splitWithUser1} Net Amount
            </p>
              <span className={styles.price} style={{ fontSize: '1.3rem', color: 'var(--fg)', fontWeight: 'bold' }}>
                <CountUp end={netAmountUser1} duration={3} prefix=" ₹ " />
              </span>
            </div>
          </div>
          <div className={styles.block}>
          <div className={styles.metric} style={{paddingBottom:'5px'}}>
            <p style={{marginTop:'0'}}>
                {bill.splitWithUser2} Bill Amount
              </p>
              {roundedSecondaryUserAmount ? (<span className={styles.price} style={{ fontSize: '1.3rem', color: 'var(--shade1)', fontWeight: 'bold' }}>
                <CountUp className={styles.billAmount} end={roundedSecondaryUserAmount} duration={3} prefix="₹ " />
              </span>) :
              (<span style={{ fontSize: '1.3rem', color: 'var(--fg)', fontWeight: 'bold' }} className={styles.price}>N/A</span>)}
            </div>
          </div>
          <div className={styles.block}>
          <div className={styles.metric} style={{paddingBottom:'5px'}}>
            <p style={{marginTop:'0'}}>
                {bill.splitWithUser2} Previous Deposit
              </p>
              <span className={styles.price} 
              style={{ 
                color: colorUser2 === 'green' ? '#009E60' : colorUser2 === 'red' ? 'red' : 'var(--fg)',
                fontSize: '1.3rem',
                fontWeight: 'bold' }}>
                <CountUp end={previousDepositUser2} duration={3} prefix=" ₹ " />
              </span>
            </div>
          </div>
          <div className={styles.block}>
          <div className={styles.metric} style={{paddingBottom:'5px'}}>
            <p style={{marginTop:'0'}}>
                {bill.splitWithUser2} Net Amount
            </p>
              <span className={styles.price} style={{ fontSize: '1.3rem', color: 'var(--fg)', fontWeight: 'bold' }}>
                <CountUp end={netAmountUser2} duration={3} prefix="₹ " />
              </span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              padding: '0 10%',
              gap: '5%',
              marginTop: '-1.5rem',
            }}
            className={styles.buttonContainer}
          >
            <button className={styles.btn} onClick={handleDelete}>
              <p>{buttonTextUser1}</p>
              <span className={styles.fa} aria-hidden="true"></span>
            </button>
            <button className={styles.btn} onClick={handleUpdate}>
              <p>{buttonTextUser2}</p>
              <span className={styles.fa} aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
