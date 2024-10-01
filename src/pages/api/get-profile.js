// pages/api/get-profile.js
import dbConnect from '../../utils/db';
import User from '../../models/User';
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

      const user = await User.findById(userId).select('username splitWithUsername1 splitWithUsername2');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
