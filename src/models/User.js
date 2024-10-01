// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  splitWithUsername1: { type: String, required: true },
  splitWithUsername2: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
