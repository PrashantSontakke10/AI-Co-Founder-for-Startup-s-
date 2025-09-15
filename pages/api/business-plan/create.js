import connectToDB from '../../../utils/db';
import BusinessPlan from '../../../models/BusinessPlan';
import aiService from '../../../src/utils/aiService';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDB();
    
    const { userId, idea, title } = req.body;

    if (!idea || !title) {
      return res.status(400).json({ message: 'Idea and title are required' });
    }

    // If no userId provided, use a default or generate one
    const finalUserId = userId || new mongoose.Types.ObjectId().toString();

    // Generate business plan using AI
    const businessPlanData = await aiService.generateBusinessPlan(idea, { userId: finalUserId });

    // Create business plan in database
    const businessPlan = new BusinessPlan({
      userId: finalUserId,
      ideaId: idea.id || Date.now().toString(),
      title,
      ...businessPlanData,
      status: 'completed'
    });

    await businessPlan.save();

    res.status(201).json({
      success: true,
      businessPlan,
      message: 'Business plan created successfully'
    });

  } catch (error) {
    console.error('Business plan creation error:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

