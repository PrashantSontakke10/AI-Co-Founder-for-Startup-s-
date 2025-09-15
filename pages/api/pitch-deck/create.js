import connectToDB from '../../../utils/db';
import PitchDeck from '../../../models/PitchDeck';
import aiService from '../../../src/utils/aiService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDB();
    
    const { userId, idea, businessPlan, title } = req.body;

    if (!userId || !idea || !title) {
      return res.status(400).json({ message: 'User ID, idea, and title are required' });
    }

    // Generate pitch deck using AI
    const pitchDeckData = await aiService.generatePitchDeck(idea, businessPlan);

    // Create pitch deck in database
    const pitchDeck = new PitchDeck({
      userId,
      businessPlanId: businessPlan?._id,
      title,
      slides: pitchDeckData,
      status: 'completed'
    });

    await pitchDeck.save();

    res.status(201).json({
      success: true,
      pitchDeck,
      message: 'Pitch deck created successfully'
    });

  } catch (error) {
    console.error('Pitch deck creation error:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

