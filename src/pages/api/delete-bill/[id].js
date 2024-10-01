// pages/api/delete-bill/[id].js
import dbConnect from '../../../utils/db';
import Bill from '../../../models/Bill';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const bill = await Bill.findById(id);

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    await Bill.deleteOne({ _id: id });

    return res.status(200).json({ message: 'Bill deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
