import connectToDB from '../../../utils/db';
import User from '../../../models/User';
import aiService from '../../../src/utils/aiService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDB();
    
    const { userInput, userId, type = 'ideas' } = req.body;

    if (!userInput) {
      return res.status(400).json({ message: 'User input is required' });
    }

    // Get user context if userId provided
    let userContext = {};
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        userContext = {
          role: user.role,
          startup: user.startup,
          profile: user.profile
        };
      }
    }

    let result = {};

    switch (type) {
      case 'ideas':
        result.ideas = await aiService.generateStartupIdeas(userInput, userContext);
        result.message = `Generated ${result.ideas.length} startup ideas based on your input about "${userInput}"`;
        break;
      
      case 'business-plan':
        const { idea } = req.body;
        if (!idea) {
          return res.status(400).json({ message: 'Idea is required for business plan generation' });
        }
        result.businessPlan = await aiService.generateBusinessPlan(idea, userContext);
        result.message = 'Business plan generated successfully';
        break;
      
      case 'pitch-deck':
        const { idea: pitchIdea, businessPlan } = req.body;
        if (!pitchIdea) {
          return res.status(400).json({ message: 'Idea is required for pitch deck generation' });
        }
        result.pitchDeck = await aiService.generatePitchDeck(pitchIdea, businessPlan);
        result.message = 'Pitch deck generated successfully';
        break;
      
      case 'financial-model':
        const { idea: financialIdea, businessPlan: financialPlan } = req.body;
        if (!financialIdea) {
          return res.status(400).json({ message: 'Idea is required for financial model generation' });
        }
        result.financialModel = await aiService.generateFinancialModel(financialIdea, financialPlan);
        result.message = 'Financial model generated successfully';
        break;
      
      case 'mvp-features':
        const { idea: mvpIdea } = req.body;
        if (!mvpIdea) {
          return res.status(400).json({ message: 'Idea is required for MVP features generation' });
        }
        result.mvpFeatures = await aiService.generateMVPFeatures(mvpIdea);
        result.message = 'MVP features generated successfully';
        break;
      
      case 'code':
        const { idea: codeIdea, mvpFeatures, techStack } = req.body;
        if (!codeIdea) {
          return res.status(400).json({ message: 'Idea is required for code generation' });
        }
        result.code = await aiService.generateCode(codeIdea, mvpFeatures, techStack);
        result.message = 'Code generated successfully';
        break;
      
      case 'investor-simulation':
        const { pitchDeck } = req.body;
        if (!pitchDeck) {
          return res.status(400).json({ message: 'Pitch deck is required for investor simulation' });
        }
        result.simulation = await aiService.simulateInvestorPitch(pitchDeck, userContext);
        result.message = 'Investor pitch simulation completed';
        break;
      
      case 'learning-path':
        const { role, interests, currentSkills } = req.body;
        result.learningPath = await aiService.generateLearningPath(role || userContext.role, interests, currentSkills);
        result.message = 'Learning path generated successfully';
        break;
      
      case 'cold-email':
        const { recipientType, startupInfo, purpose } = req.body;
        if (!recipientType || !startupInfo || !purpose) {
          return res.status(400).json({ message: 'Recipient type, startup info, and purpose are required' });
        }
        result.emailTemplate = await aiService.generateColdEmailTemplate(recipientType, startupInfo, purpose);
        result.message = 'Cold email template generated successfully';
        break;
      
      default:
        return res.status(400).json({ message: 'Invalid type parameter' });
    }

    res.status(200).json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Ideation API error:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

