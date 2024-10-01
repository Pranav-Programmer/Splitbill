import dbConnect from '../../utils/db';
import Bill from '../../models/Bill';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key';

async function fetchBills(userId) {
  await dbConnect();
  const bills = await Bill.find({ userId }).sort({ date: 1 });
  return bills;
}

export default async function handler(req, res) {
  await dbConnect();

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  if (req.method === 'GET') {
    try {
      const { userId } = jwt.verify(token, JWT_SECRET);

      const bills = await fetchBills(userId);
      if (!bills || bills.length === 0) {
        return res.status(404).json({ message: 'No bills found' });
      }

      let totalConsumptionArray = [];
      let secondaryConsumptionArray = [];
      let sharedConsumptionArray = [];
      let primaryConsumptionArray = [];

      for (let i = 1; i < bills.length; i++) {
        const currentBill = bills[i];
        const previousBill = bills[i - 1];

        const totalConsumptionThisMonth = currentBill.mainMeterReading - previousBill.mainMeterReading;
        const secondaryUserConsumption = currentBill.splitWithMeterReading - previousBill.splitWithMeterReading;
        const sharedConsumption = currentBill.equalReading - previousBill.equalReading;
        const primaryUserConsumption = totalConsumptionThisMonth - secondaryUserConsumption - sharedConsumption;

        totalConsumptionArray.push(totalConsumptionThisMonth);
        secondaryConsumptionArray.push(secondaryUserConsumption);
        sharedConsumptionArray.push(sharedConsumption);
        primaryConsumptionArray.push(primaryUserConsumption);
      }

      // Function to normalize a value to range 1-100
      const normalize = (value, min, max) => {
        return ((value - min) / (max - min)) * 99 + 1;
      };

      // Get min and max for each metric
      
      const totalConsumptionMax = Math.max(...totalConsumptionArray);
      const secondaryConsumptionMax = Math.max(...secondaryConsumptionArray);
      const sharedConsumptionMax = Math.max(...sharedConsumptionArray)
      const primaryConsumptionMax = Math.max(...primaryConsumptionArray);

      // Array to hold normalized consumption data for each bill
      const consumptionData = [];

      // Normalize each value, round to nearest integer, and prepare the response object
      for (let i = 1; i < bills.length; i++) {
        const currentBill = bills[i];
        const previousBill = bills[i - 1];

        const totalConsumptionThisMonth = currentBill.mainMeterReading - previousBill.mainMeterReading;
        const secondaryUserConsumption = currentBill.splitWithMeterReading - previousBill.splitWithMeterReading;
        const sharedConsumption = currentBill.equalReading - previousBill.equalReading;
        const primaryUserConsumption = totalConsumptionThisMonth - secondaryUserConsumption - sharedConsumption;

        consumptionData.push({
          month: new Date(currentBill.date).toLocaleString('default', { month: 'short', year: 'numeric' }),
          totalConsumptionThisMonthNor: Math.round(normalize(totalConsumptionThisMonth, 0, totalConsumptionMax)),
          primaryUserConsumptionNor: Math.round(normalize(primaryUserConsumption, 0, primaryConsumptionMax)),
          secondaryUserConsumptionNor: Math.round(normalize(secondaryUserConsumption, 0, secondaryConsumptionMax)),
          sharedConsumptionNor: Math.round(normalize(sharedConsumption, 0, sharedConsumptionMax)),

          totalConsumptionThisMonth: currentBill.mainMeterReading - previousBill.mainMeterReading,
          secondaryUserConsumption: currentBill.splitWithMeterReading - previousBill.splitWithMeterReading,
          sharedConsumption: currentBill.equalReading - previousBill.equalReading,
          primaryUserConsumption: totalConsumptionThisMonth - secondaryUserConsumption - sharedConsumption,
          primaryUserName: currentBill.splitWithUser1,
          secondaryUserName: currentBill.splitWithUser2,
        });
      }

      res.status(200).json({ data: consumptionData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch electricity consumption data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
