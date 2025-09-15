import connectToDB from '../../../utils/db';
import FinancialModel from '../../../models/FinancialModel';
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

    // Generate financial model using AI
    const financialModelData = await aiService.generateFinancialModel(idea, businessPlan);

    // Create financial model in database
    const financialModel = new FinancialModel({
      userId,
      businessPlanId: businessPlan?._id,
      title,
      ...financialModelData,
      status: 'completed'
    });

    await financialModel.save();

    res.status(201).json({
      success: true,
      financialModel,
      message: 'Financial model created successfully'
    });

  } catch (error) {
    console.error('Financial model creation error:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

