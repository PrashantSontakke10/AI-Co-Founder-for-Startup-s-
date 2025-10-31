import connectToDB from '../../../utils/db';
import aiService from '../../../src/utils/aiService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { pitchDeck, userContext } = req.body;

    if (!pitchDeck) {
      return res.status(400).json({ message: 'Pitch deck is required' });
    }

    let simulation;
    
    try {
      // Try to generate with AI service
      simulation = await aiService.simulateInvestorPitch(pitchDeck, userContext);
    } catch (aiError) {
      console.error('AI simulation failed, using fallback simulation:', aiError.message);
      
      // Generate personalized simulation based on pitch deck content
      const ideaTitle = pitchDeck.title || pitchDeck.name || 'Your Startup';
      const industry = pitchDeck.industry || pitchDeck.category || 'Technology';
      const stage = pitchDeck.stage || 'Early Stage';
      const marketSize = pitchDeck.marketSize || 'Unknown';
      const description = pitchDeck.description || '';
      
      // Generate industry-specific feedback
      const getIndustrySpecificContent = (industry) => {
        const industryMap = {
          'Technology': {
            strengths: ['Strong technical team', 'Scalable technology platform', 'Clear product-market fit potential', 'Innovative solution'],
            weaknesses: ['High development costs', 'Rapid technology changes', 'Intense competition', 'Long development cycles'],
            questions: [
              'How do you plan to protect your intellectual property?',
              'What is your technology stack and why did you choose it?',
              'How will you handle technical debt as you scale?',
              'What are your plans for data security and privacy compliance?'
            ],
            concerns: ['Technology scalability', 'IP protection', 'Technical team retention', 'Regulatory compliance']
          },
          'Healthcare': {
            strengths: ['Large addressable market', 'Clear regulatory pathway', 'Strong clinical need', 'Experienced medical team'],
            weaknesses: ['Long regulatory approval process', 'High development costs', 'Complex reimbursement landscape', 'Clinical trial risks'],
            questions: [
              'What is your regulatory strategy and timeline?',
              'How do you plan to navigate the reimbursement process?',
              'What clinical evidence do you have for your solution?',
              'How will you handle FDA approval requirements?'
            ],
            concerns: ['Regulatory approval timeline', 'Clinical trial success', 'Reimbursement strategy', 'Market adoption']
          },
          'Finance': {
            strengths: ['Large market opportunity', 'Clear revenue model', 'Regulatory compliance expertise', 'Strong financial metrics'],
            weaknesses: ['Heavy regulatory requirements', 'High compliance costs', 'Intense competition', 'Customer acquisition challenges'],
            questions: [
              'How do you ensure regulatory compliance across different jurisdictions?',
              'What is your customer acquisition strategy in a competitive market?',
              'How do you handle cybersecurity and fraud prevention?',
              'What partnerships do you have with financial institutions?'
            ],
            concerns: ['Regulatory compliance', 'Cybersecurity risks', 'Customer acquisition costs', 'Competitive differentiation']
          },
          'Education': {
            strengths: ['Large addressable market', 'Clear value proposition', 'Scalable business model', 'Strong social impact'],
            weaknesses: ['Long sales cycles', 'Budget constraints', 'Resistance to change', 'Seasonal demand'],
            questions: [
              'How do you measure learning outcomes and student success?',
              'What is your go-to-market strategy for educational institutions?',
              'How do you handle different learning styles and accessibility?',
              'What partnerships do you have with schools and universities?'
            ],
            concerns: ['Student outcome measurement', 'Institutional adoption', 'Seasonal revenue patterns', 'Competition with traditional methods']
          },
          'Sustainability': {
            strengths: ['Growing market demand', 'Environmental impact', 'Government support', 'Clear value proposition'],
            weaknesses: ['High upfront costs', 'Long payback periods', 'Regulatory uncertainty', 'Market education needed'],
            questions: [
              'How do you measure and verify environmental impact?',
              'What is your strategy for cost reduction over time?',
              'How do you handle regulatory changes in environmental policy?',
              'What partnerships do you have with sustainability organizations?'
            ],
            concerns: ['Environmental impact measurement', 'Cost competitiveness', 'Regulatory changes', 'Market education']
          }
        };
        
        return industryMap[industry] || industryMap['Technology'];
      };
      
      const industryContent = getIndustrySpecificContent(industry);
      
      // Generate stage-specific feedback
      const getStageSpecificContent = (stage) => {
        const stageMap = {
          'Pre-seed': {
            score: 6.5,
            recommendation: 'Pass - too early',
            amount: '$0',
            terms: 'N/A',
            reasoning: 'Idea is promising but needs more validation before investment'
          },
          'Seed': {
            score: 7.2,
            recommendation: 'Invest with conditions',
            amount: '$250K - $500K',
            terms: 'Convertible note with 20% discount and $5M cap',
            reasoning: 'Strong potential but needs more market validation'
          },
          'Series A': {
            score: 8.1,
            recommendation: 'Invest',
            amount: '$2M - $5M',
            terms: 'Series A with 15-20% equity',
            reasoning: 'Proven traction and strong team, ready for growth capital'
          },
          'Series B': {
            score: 8.5,
            recommendation: 'Invest',
            amount: '$5M - $15M',
            terms: 'Series B with 10-15% equity',
            reasoning: 'Strong metrics and clear path to profitability'
          }
        };
        
        return stageMap[stage] || stageMap['Seed'];
      };
      
      const stageContent = getStageSpecificContent(stage);
      
      simulation = {
        feedback: {
          strengths: [
            ...industryContent.strengths,
            'Clear problem identification and solution',
            'Experienced founding team',
            'Scalable business model'
          ],
          weaknesses: [
            ...industryContent.weaknesses,
            'Limited market validation data',
            'Need for stronger financial projections',
            'Unclear go-to-market strategy'
          ],
          overallScore: stageContent.score,
          recommendation: stageContent.recommendation
        },
        questions: [
          ...industryContent.questions.map(q => ({
            question: q,
            category: 'Industry',
            difficulty: 'Medium'
          })),
          {
            question: 'What is your customer acquisition cost and how do you plan to scale it?',
            category: 'Financial',
            difficulty: 'Medium'
          },
          {
            question: 'Who are your main competitors and how do you differentiate?',
            category: 'Market',
            difficulty: 'Easy'
          },
          {
            question: 'What is your path to profitability and timeline?',
            category: 'Financial',
            difficulty: 'Hard'
          },
          {
            question: 'How do you plan to use the funding and what are your key milestones?',
            category: 'Strategy',
            difficulty: 'Medium'
          },
          {
            question: 'What are the main risks to your business model?',
            category: 'Risk',
            difficulty: 'Medium'
          }
        ],
        concerns: [
          ...industryContent.concerns.map(concern => ({
            concern: concern,
            severity: 'Medium',
            mitigation: `Develop comprehensive strategy to address ${concern.toLowerCase()}`
          })),
          {
            concern: 'Market size validation needs more data',
            severity: 'Medium',
            mitigation: 'Conduct additional market research and customer interviews'
          },
          {
            concern: 'Competitive landscape analysis is incomplete',
            severity: 'High',
            mitigation: 'Develop comprehensive competitive analysis with positioning'
          },
          {
            concern: 'Financial projections seem optimistic',
            severity: 'Medium',
            mitigation: 'Provide more conservative scenarios and assumptions'
          }
        ],
        suggestions: [
          `Strengthen your ${industry.toLowerCase()} expertise with industry-specific research`,
          'Develop a more detailed competitive analysis',
          'Create multiple financial scenarios (conservative, realistic, optimistic)',
          'Build stronger customer validation before next funding round',
          'Consider strategic partnerships to accelerate growth',
          'Focus on key metrics that matter to your industry',
          'Build relationships with industry experts and advisors'
        ],
        investmentDecision: {
          decision: stageContent.recommendation,
          amount: stageContent.amount,
          terms: stageContent.terms,
          reasoning: stageContent.reasoning
        }
      };
    }

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









