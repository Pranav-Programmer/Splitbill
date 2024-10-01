// pages/api/get-bills.js
import dbConnect from '../../utils/db';
import Bill from '../../models/Bill';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authorization.split(' ')[1];

    try {
      const { userId } = jwt.verify(token, JWT_SECRET);
      const bills = await Bill.find({ userId });

      res.status(200).json({ bills });
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
