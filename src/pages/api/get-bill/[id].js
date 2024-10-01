import dbConnect from '../../../utils/db';
import Bill from '../../../models/Bill';

export default async function handler(req, res) {
  const { id } = req.query;

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const bill = await Bill.findById(id);
      if (!bill) {
        return res.status(404).json({ message: 'Bill not found' });
      }
      res.status(200).json({ bill });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
