// pages/api/get-previous-bill.js
import dbConnect from '../../utils/db';
import Bill from '../../models/Bill';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { authorization } = req.headers;
    const { billDate } = req.query;

    if (!authorization) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authorization.split(' ')[1];

    try {
      const { userId } = jwt.verify(token, JWT_SECRET);

      if (!billDate) {
        return res.status(400).json({ message: 'Bill date is required' });
      }

      // Parse the billDate to a Date object
      const billDateObj = new Date(billDate);
      // Get the first day of the current month based on the bill date
      const firstDayCurrentMonth = new Date(billDateObj.getFullYear(), billDateObj.getMonth(), 1);
      // Get the first day of the previous month based on the bill date
      const firstDayPreviousMonth = new Date(billDateObj.getFullYear(), billDateObj.getMonth() - 1, 1);
      // Get the last day of the previous month based on the bill date
      const lastDayPreviousMonth = new Date(billDateObj.getFullYear(), billDateObj.getMonth(), 0);

      const previousBill = await Bill.findOne({
        userId,
        date: {
          $gte: firstDayPreviousMonth,
          $lt: firstDayCurrentMonth
        }
      }).sort({ date: -1 });

      if (!previousBill) {
        return res.status(200).json({ bill: {} });
      }

      // Format date to yyyy-mm-dd
      previousBill.date = new Date(previousBill.date).toISOString().split('T')[0];

      res.status(200).json({ bill: previousBill });
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
