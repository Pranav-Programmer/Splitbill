import dbConnect from '../../utils/db';
import User from '../../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key';

export default async function handler(req, res) {
  await dbConnect();

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const { primaryUsername, secondaryUsername1, secondaryUsername2} = req.body;

  if (!primaryUsername || !secondaryUsername1 || !secondaryUsername2) {
    return res.status(400).json({ message: 'Primary and Secondary usernames are required' });
  }

  try {
    const { userId } = jwt.verify(token, JWT_SECRET);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: primaryUsername,
        splitWithUsername1: secondaryUsername1,
        splitWithUsername2: secondaryUsername2,
      },
      { new: true }
    ).select('username splitWithUsername1 splitWithUsername2');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update usernames' });
  }
}
