// pages/api/add-user.js
import dbConnect from '../../utils/db';
import User from '../../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { token, name, meterReading } = req.body;

    try {
      const { userId } = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.users.push({ name, meterReading });

      await user.save();

      res.status(200).json({ message: 'User added' });
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
