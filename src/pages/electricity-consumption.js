// pages/electricity-consumption.js
import { useEffect, useState } from 'react';
import styles from '@/components/electricity-consumption.module.css';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const ElectricityConsumption = ({updatedPrimaryUsername, updatedSecondaryUsername}) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('/api/electricity-consumption', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message);
        setData(result.data);
        setSelectedMonth(result.data.length - 1); 
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (data.length === 0) {
    return <p>No data available</p>;
  }

  const selectedData = data[selectedMonth];

  return (
    <div className={styles['main-container']}>
      <div className={styles['year-stats']}>
        {data.slice().reverse().map((item, index) => (
          <div
            className={styles['month-group']}
            key={index}
            onClick={() => setSelectedMonth(data.length - 1 - index)}
          >
            <div className={`${styles.bar} ${styles[`h-${(item.totalConsumptionThisMonthNor)}`]}`}></div>
            <p className={styles.month}>{new Date(item.month).toLocaleString('default', { month: 'long' }).slice(0, 3)}</p>
          </div>
        ))}
      </div>
      
      {selectedMonth !== null && (
        <div className={styles['stats-info']}>
          <div className={styles['graph-container']}>
            <div style={{marginRight:'2rem'}} className={styles.percent}>
              <svg viewBox="0 0 36 36" style={{width:'125%'}} className={styles['circular-chart']}>
                <path 
                  className={styles.circle} 
                  strokeDasharray={`${((selectedData.primaryUserConsumption/selectedData.totalConsumptionThisMonth)*100)+(((selectedData.secondaryUserConsumption/selectedData.totalConsumptionThisMonth)*100)+((selectedData.sharedConsumption/selectedData.totalConsumptionThisMonth)*100))}, 100`} 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                />
                <path 
                  className={styles.circle} 
                  strokeDasharray={`${(((selectedData.secondaryUserConsumption/selectedData.totalConsumptionThisMonth)*100)+((selectedData.sharedConsumption/selectedData.totalConsumptionThisMonth)*100))}, 100`} 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                />
                <path 
                  className={styles.circle} 
                  strokeDasharray={`${((selectedData.sharedConsumption/selectedData.totalConsumptionThisMonth)*100)}, 100`} 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                />
              </svg>
            </div>
            <div>
            <p style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem'}}>
                <div>
                {selectedData.month}
                </div>
                <div>
                {selectedData.totalConsumptionThisMonth} units
                </div>
            </p>
            </div>
          </div>

          <div className={styles.info} >
            <div style={{display:'flex', flexDirection:'row', gap:'10px'}}><FiberManualRecordIcon style={{color:"#9a40d2"}}/><p style={{marginTop:'3px'}}>{selectedData.primaryUserName}<span> : {selectedData.primaryUserConsumption} units</span></p></div>
            <div style={{display:'flex', flexDirection:'row', gap:'10px'}}><FiberManualRecordIcon style={{color:"#e59f3c"}}/><p style={{marginTop:'3px'}}>{selectedData.secondaryUserName}<span> : {selectedData.secondaryUserConsumption} units</span></p></div>
            <div style={{display:'flex', flexDirection:'row', gap:'10px'}}><FiberManualRecordIcon style={{color:"#16f7a1"}}/><p style={{marginTop:'3px'}}>Shared<span> : {selectedData.sharedConsumption} units</span></p></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectricityConsumption;
