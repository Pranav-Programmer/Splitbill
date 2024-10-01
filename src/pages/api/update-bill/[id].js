// pages/api/update-bill/[id].js
import dbConnect from '../../../utils/db';
import Bill from '../../../models/Bill';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key';

export default async function handler(req, res) {
  await dbConnect();

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const { id } = req.query;
  const { totalBillAmount } = req.body;

  if (!totalBillAmount) {
    return res.status(400).json({ message: 'Total bill amount is required' });
  }

  try {
    const { userId } = jwt.verify(token, JWT_SECRET);

    const updatedBill = await Bill.findByIdAndUpdate(
      id,
      {
        totalBillAmount: Number(totalBillAmount),
      },
      { new: true }
    );

    if (!updatedBill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.status(200).json({ bill: updatedBill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update bill amount' });
  }
}
