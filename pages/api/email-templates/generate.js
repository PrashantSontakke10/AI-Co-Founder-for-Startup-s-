import connectToDB from '../../../utils/db';
import aiService from '../../../src/utils/aiService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { recipientType, startupInfo, purpose } = req.body;

    if (!recipientType || !startupInfo || !purpose) {
      return res.status(400).json({ message: 'Recipient type, startup info, and purpose are required' });
    }

    let emailTemplate;
    
    try {
      // Try to generate with AI service
      emailTemplate = await aiService.generateColdEmailTemplate(recipientType, startupInfo, purpose);
    } catch (aiError) {
      console.error('AI generation failed, using fallback template:', aiError.message);
      
      // Fallback template based on recipient type and purpose
      const templates = {
        investor: {
          funding: {
            subject: `Investment Opportunity: ${startupInfo.name || 'Our Startup'}`,
            template: `Dear [Investor Name],

I hope this email finds you well. I'm reaching out to introduce ${startupInfo.name || 'our startup'}, a ${startupInfo.industry || 'innovative'} company that's ${startupInfo.description || 'solving important problems in the market'}.

We're currently seeking ${purpose === 'funding' ? 'investment' : 'partnership'} to accelerate our growth and would love to share our vision with you.

Key highlights:
- ${startupInfo.description || 'Strong market opportunity with clear value proposition'}
- ${startupInfo.stage || 'Early traction'} with promising results
- Experienced team with deep industry expertise

Would you be available for a brief call this week to discuss the opportunity? I'd be happy to send over our pitch deck and answer any questions you might have.

Thank you for your time and consideration.

Best regards,
[Your Name]
[Your Title]
${startupInfo.name || 'Company Name'}`
          }
        },
        mentor: {
          mentorship: {
            subject: `Seeking Mentorship: ${startupInfo.name || 'Our Startup'}`,
            template: `Dear [Mentor Name],

I hope this message finds you well. I'm writing to introduce myself and ${startupInfo.name || 'our startup'}, a ${startupInfo.industry || 'innovative'} venture that's ${startupInfo.description || 'addressing important market needs'}.

Your experience in ${startupInfo.industry || 'this space'} would be incredibly valuable as we navigate the challenges of building and scaling our business.

We're particularly interested in guidance on:
- Strategic planning and market positioning
- Building effective teams and partnerships
- Navigating the fundraising process

Would you be open to a brief conversation about potential mentorship opportunities? I'd be grateful for any time you could spare.

Thank you for considering this request.

Best regards,
[Your Name]
[Your Title]
${startupInfo.name || 'Company Name'}`
          }
        },
        customer: {
          sales: {
            subject: `Introducing ${startupInfo.name || 'Our Solution'} - ${startupInfo.description || 'A better way to solve your challenges'}`,
            template: `Dear [Customer Name],

I hope this email finds you well. I'm writing to introduce ${startupInfo.name || 'our solution'}, which ${startupInfo.description || 'helps companies like yours achieve better results'}.

We've been working with similar companies in your industry and have seen significant improvements in:
- Efficiency and productivity
- Cost reduction and optimization
- Better customer satisfaction

I'd love to schedule a brief 15-minute call to show you how ${startupInfo.name || 'our solution'} could benefit your organization. Would you be available for a quick conversation this week?

Thank you for your time and consideration.

Best regards,
[Your Name]
[Your Title]
${startupInfo.name || 'Company Name'}`
          }
        },
        partner: {
          partnership: {
            subject: `Partnership Opportunity: ${startupInfo.name || 'Our Startup'}`,
            template: `Dear [Partner Name],

I hope this message finds you well. I'm reaching out to explore potential partnership opportunities between ${startupInfo.name || 'our company'} and ${startupInfo.description || 'your organization'}.

We believe there's significant synergy between our offerings and would love to discuss how we might work together to create mutual value.

Potential collaboration areas:
- Joint product development
- Cross-referral programs
- Strategic alliances
- Market expansion initiatives

Would you be interested in a brief conversation to explore these opportunities? I'd be happy to share more details about our vision and discuss how we might work together.

Thank you for your time and consideration.

Best regards,
[Your Name]
[Your Title]
${startupInfo.name || 'Company Name'}`
          }
        }
      };

      const template = templates[recipientType]?.[purpose] || templates.investor.funding;
      
      emailTemplate = {
        subject: template.subject,
        template: template.template,
        personalizationTips: [
          'Research the recipient before sending',
          'Mention specific details about their work or company',
          'Keep the email concise and focused',
          'Include a clear call to action',
          'Follow up within a week if no response'
        ],
        followUpTemplate: `Hi [Name],

I wanted to follow up on my previous email about ${startupInfo.name || 'our opportunity'}. I understand you're busy, but I'd love to share how we might work together.

Would you be available for a brief 15-minute call this week?

Best regards,
[Your Name]`,
        bestPractices: [
          'Personalize each email',
          'Keep subject lines clear and compelling',
          'Send at optimal times (Tuesday-Thursday, 10am-2pm)',
          'Follow up appropriately',
          'Track and measure results'
        ]
      };
    }

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









