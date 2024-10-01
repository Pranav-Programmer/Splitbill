import mongoose from 'mongoose';

const BillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  mainMeterReading: { type: Number, required: true },
  splitWithMeterReading: { type: Number, required: true },
  equalReading: { type: Number, required: true },
  totalBillAmount: { type: Number, required: true },
  splitWithUser1: { type: String, required: true },
  splitWithUser2: { type: String, required: true },
  previousDepositUser1: { type: Number, required: true }, // New field
  previousDepositUser2: { type: Number, required: true }, // New field
});

export default mongoose.models.Bill || mongoose.model('Bill', BillSchema);
