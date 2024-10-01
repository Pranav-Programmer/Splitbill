// pages/api/get-current-user.js
import dbConnect from '../../utils/db';
import User from '../../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key';

export default async function handler(req, res) {
  await dbConnect();

  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

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
}
