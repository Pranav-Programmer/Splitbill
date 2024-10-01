// models/ElectricityConsumption.js
import mongoose from 'mongoose';

const ElectricityConsumptionSchema = new mongoose.Schema({
  month: { type: String, required: true },
  consumptionPercentage: { type: Number, required: true },
  total: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.models.ElectricityConsumption || mongoose.model('ElectricityConsumption', ElectricityConsumptionSchema);
