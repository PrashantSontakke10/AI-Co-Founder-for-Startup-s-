import connectToDB from '../../../utils/db';
import aiService from '../../../src/utils/aiService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDB();
    
    const { recipientType, startupInfo, purpose } = req.body;

    if (!recipientType || !startupInfo || !purpose) {
      return res.status(400).json({ message: 'Recipient type, startup info, and purpose are required' });
    }

    // Generate cold email template using AI
    const emailTemplate = await aiService.generateColdEmailTemplate(recipientType, startupInfo, purpose);

    res.status(200).json({
      success: true,
      emailTemplate,
      message: 'Cold email template generated successfully'
    });

  } catch (error) {
    console.error('Email template generation error:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}





