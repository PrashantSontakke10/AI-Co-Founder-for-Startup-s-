import connectToDB from '../../../utils/db';
import Feedback from '../../../models/Feedback';
import Alert from '../../../models/Alert';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { rating, comment, path, context, contact } = req.body || {};

  if (!rating && !comment) {
    return res.status(400).json({ message: 'Provide at least rating or comment' });
  }

  await connectToDB();

  try {
    const feedback = await Feedback.create({
      rating: typeof rating === 'number' ? rating : undefined,
      comment: comment || '',
      path: path || '',
      context: context || {},
      contact: contact || ''
    });

    await Alert.create({
      type: 'feedback',
      title: 'New user feedback received',
      message: comment ? comment.slice(0, 140) : `Rating: ${rating}`,
      link: '/dashboard',
    });

    return res.status(201).json({ message: 'Thanks for your feedback!', id: feedback._id });
  } catch (err) {
    console.error('Feedback submit error', err);
    return res.status(500).json({ message: 'Failed to submit feedback' });
  }
}


