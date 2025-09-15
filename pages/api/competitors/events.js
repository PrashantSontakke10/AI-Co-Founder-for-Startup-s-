import connectToDB from '../../../utils/db';
import CompetitorEvent from '../../../models/CompetitorEvent';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  await connectToDB();
  const { limit = '20' } = req.query;
  const n = Math.min(parseInt(limit, 10) || 20, 100);
  const events = await CompetitorEvent.find({}).sort({ publishedAt: -1 }).limit(n);
  return res.status(200).json({ events });
}


