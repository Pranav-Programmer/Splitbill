// pages/api/register.js
import dbConnect from '../../utils/db';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { username, password, splitWithUsername1, splitWithUsername2 } = req.body;

    // Validation checks
    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }

    if (password.length < 3) {
      return res.status(400).json({ message: 'Password must be at least 3 characters long' });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      splitWithUsername1,
      splitWithUsername2,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
