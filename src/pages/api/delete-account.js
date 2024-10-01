// pages/api/delete-account.js
import dbConnect from '../../utils/db';
import User from '../../models/User';
import Bill from '../../models/Bill';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key';

export default async function handler(req, res) {
  await dbConnect();

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  if (req.method === 'DELETE') {
    try {
      const { userId } = jwt.verify(token, JWT_SECRET);

      // Delete the user's bills
      await Bill.deleteMany({ userId });

      // Delete the user
      await User.findByIdAndDelete(userId);

      res.status(200).json({ message: 'Account and associated bills deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete account' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
