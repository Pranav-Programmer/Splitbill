import dbConnect from '../../utils/db';
import Bill from '../../models/Bill';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { date, mainMeterReading, splitWithMeterReading, equalReading, totalBillAmount, splitWithUser1, splitWithUser2, previousDepositUser1, previousDepositUser2 } = req.body;

    try {
      const token = req.headers.authorization.split(' ')[1];
      const { userId } = jwt.verify(token, JWT_SECRET);

      const newBill = new Bill({
        userId,
        date,
        mainMeterReading,
        splitWithMeterReading,
        equalReading,
        totalBillAmount,
        splitWithUser1,
        splitWithUser2,
        previousDepositUser1, // New field
        previousDepositUser2, // New field
      });

      await newBill.save();

      res.status(201).json({ message: 'Bill added' });
    } catch (error) {
      console.error('Error adding bill:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
