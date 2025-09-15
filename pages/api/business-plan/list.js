import connectToDB from '../../../utils/db';
import BusinessPlan from '../../../models/BusinessPlan';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDB();
    
    const { userId, limit = 10, status } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Build query
    const query = { userId };
    if (status) {
      query.status = status;
    }

    // Get business plans
    const businessPlans = await BusinessPlan.find(query)
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'profile firstName lastName email');

    res.status(200).json({
      success: true,
      businessPlans,
      count: businessPlans.length
    });

  } catch (error) {
    console.error('Business plan list error:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

