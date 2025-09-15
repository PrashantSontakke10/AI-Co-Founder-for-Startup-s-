import connectToDB from '../../../utils/db';
import aiService from '../../../src/utils/aiService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDB();
    
    const { pitchDeck, userContext } = req.body;

    if (!pitchDeck) {
      return res.status(400).json({ message: 'Pitch deck is required' });
    }

    // Simulate investor pitch using AI
    const simulation = await aiService.simulateInvestorPitch(pitchDeck, userContext);

    res.status(200).json({
      success: true,
      simulation,
      message: 'Investor pitch simulation completed'
    });

  } catch (error) {
    console.error('Investor simulation error:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}





