import connectToDB from '../../../utils/db';
import MVPFeature from '../../../models/MVPFeature';
import aiService from '../../../src/utils/aiService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDB();
    
    const { userId, idea, title } = req.body;

    if (!userId || !idea || !title) {
      return res.status(400).json({ message: 'User ID, idea, and title are required' });
    }

    // Generate MVP features using AI
    const mvpFeaturesData = await aiService.generateMVPFeatures(idea);

    // Create MVP features in database
    const mvpFeatures = new MVPFeature({
      userId,
      ideaId: idea.id || Date.now().toString(),
      title,
      ...mvpFeaturesData,
      status: 'completed'
    });

    await mvpFeatures.save();

    res.status(201).json({
      success: true,
      mvpFeatures,
      message: 'MVP features created successfully'
    });

  } catch (error) {
    console.error('MVP features creation error:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

