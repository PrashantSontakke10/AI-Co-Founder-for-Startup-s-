import connectToDB from '../../../utils/db';
import Alert from '../../../models/Alert';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  await connectToDB();
  const { limit = '20' } = req.query;
  const n = Math.min(parseInt(limit, 10) || 20, 100);
  const alerts = await Alert.find({}).sort({ createdAt: -1 }).limit(n);
  return res.status(200).json({ alerts });
}


