import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

class AIService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateStartupIdeas(userInput, context = {}) {
    const prompt = `
    You are an expert startup ideation consultant. Based on the user's input, generate 3 innovative startup ideas with detailed analysis.

    User Input: "${userInput}"
    User Context: ${JSON.stringify(context)}

    For each idea, provide:
    1. Title
    2. Description (2-3 sentences)
    3. Problem statement
    4. Solution approach
    5. Target audience
    6. Revenue model
    7. Market size estimate
    8. Growth potential
    9. Category/Industry
    10. Key differentiators

    Focus on:
    - Solving real problems
    - Scalable business models
    - Market opportunities
    - Innovation and differentiation
    - Feasibility

    Return as JSON array with this structure:
    [
      {
        "id": "unique_id",
        "title": "Startup Name",
        "description": "Brief description",
        "problem": "Problem being solved",
        "solution": "Solution approach",
        "targetAudience": "Target customers",
        "revenueModel": "How to make money",
        "marketSize": "Market size estimate",
        "growthRate": "Growth potential",
        "category": "Industry category",
        "differentiators": ["Key differentiator 1", "Key differentiator 2"],
        "feasibility": "High/Medium/Low",
        "investmentNeeded": "Estimated funding needed"
      }
    ]
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback to structured response
      return this.parseStructuredResponse(text);
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate startup ideas');
    }
  }

  async generateBusinessPlan(idea, userContext = {}) {
    const prompt = `
    You are a business strategy expert. Create a comprehensive business plan for this startup idea:

    Startup Idea: ${JSON.stringify(idea)}
    User Context: ${JSON.stringify(userContext)}

    Generate a detailed business plan including:

    1. Executive Summary
    2. Market Analysis
    3. Competitive Analysis
    4. Business Model Canvas (9 sections)
    5. Financial Projections (3 years)
    6. Marketing Strategy
    7. Operations Plan
    8. Risk Analysis
    9. Funding Requirements
    10. Milestones and Timeline

    Return as JSON with this structure:
    {
      "executiveSummary": "Brief overview",
      "marketAnalysis": {
        "marketSize": "Total addressable market",
        "targetMarket": "Specific target market",
        "marketTrends": ["Trend 1", "Trend 2"],
        "customerSegments": ["Segment 1", "Segment 2"]
      },
      "competitiveAnalysis": {
        "directCompetitors": ["Competitor 1", "Competitor 2"],
        "indirectCompetitors": ["Competitor 3", "Competitor 4"],
        "competitiveAdvantages": ["Advantage 1", "Advantage 2"]
      },
      "businessModelCanvas": {
        "keyPartners": ["Partner 1", "Partner 2"],
        "keyActivities": ["Activity 1", "Activity 2"],
        "keyResources": ["Resource 1", "Resource 2"],
        "valuePropositions": ["Value 1", "Value 2"],
        "customerRelationships": ["Relationship 1", "Relationship 2"],
        "channels": ["Channel 1", "Channel 2"],
        "customerSegments": ["Segment 1", "Segment 2"],
        "costStructure": ["Cost 1", "Cost 2"],
        "revenueStreams": ["Revenue 1", "Revenue 2"]
      },
      "financialProjections": {
        "year1": {"revenue": 0, "expenses": 0, "profit": 0},
        "year2": {"revenue": 0, "expenses": 0, "profit": 0},
        "year3": {"revenue": 0, "expenses": 0, "profit": 0}
      },
      "marketingStrategy": {
        "channels": ["Channel 1", "Channel 2"],
        "budget": "Marketing budget",
        "metrics": ["Metric 1", "Metric 2"]
      },
      "operationsPlan": {
        "team": ["Role 1", "Role 2"],
        "infrastructure": ["Infrastructure 1", "Infrastructure 2"],
        "processes": ["Process 1", "Process 2"]
      },
      "riskAnalysis": {
        "risks": ["Risk 1", "Risk 2"],
        "mitigation": ["Mitigation 1", "Mitigation 2"]
      },
      "fundingRequirements": {
        "amount": "Total funding needed",
        "useOfFunds": ["Use 1", "Use 2"],
        "fundingRounds": ["Round 1", "Round 2"]
      },
      "milestones": [
        {"timeline": "Month 1-3", "milestone": "Milestone 1"},
        {"timeline": "Month 4-6", "milestone": "Milestone 2"}
      ]
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse business plan response');
    } catch (error) {
      console.error('Business Plan Generation Error:', error);
      throw new Error('Failed to generate business plan');
    }
  }

  async generatePitchDeck(idea, businessPlan) {
    const prompt = `
    You are a pitch deck expert. Create a compelling pitch deck for this startup:

    Idea: ${JSON.stringify(idea)}
    Business Plan: ${JSON.stringify(businessPlan)}

    Generate slides for a pitch deck including:

    1. Title Slide
    2. Problem Statement
    3. Solution
    4. Market Opportunity
    5. Business Model
    6. Traction/Milestones
    7. Financial Projections
    8. Team
    9. Competition
    10. Ask/Use of Funds

    Return as JSON array:
    [
      {
        "slideNumber": 1,
        "title": "Slide Title",
        "content": "Slide content",
        "visuals": "Suggested visuals",
        "notes": "Speaker notes"
      }
    ]
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse pitch deck response');
    } catch (error) {
      console.error('Pitch Deck Generation Error:', error);
      throw new Error('Failed to generate pitch deck');
    }
  }

  async generateFinancialModel(idea, businessPlan) {
    const prompt = `
    You are a financial modeling expert. Create a detailed financial model for this startup:

    Idea: ${JSON.stringify(idea)}
    Business Plan: ${JSON.stringify(businessPlan)}

    Generate financial projections including:

    1. Revenue Projections (Monthly for Year 1, Quarterly for Years 2-3)
    2. Cost Structure
    3. Cash Flow Analysis
    4. Break-even Analysis
    5. Unit Economics
    6. Funding Requirements
    7. Valuation Estimates

    Return as JSON:
    {
      "revenueProjections": {
        "year1": {"month1": 0, "month2": 0, ...},
        "year2": {"q1": 0, "q2": 0, "q3": 0, "q4": 0},
        "year3": {"q1": 0, "q2": 0, "q3": 0, "q4": 0}
      },
      "costStructure": {
        "fixedCosts": {"salaries": 0, "rent": 0, "utilities": 0},
        "variableCosts": {"marketing": 0, "production": 0, "support": 0}
      },
      "cashFlow": {
        "year1": {"month1": 0, "month2": 0, ...},
        "year2": {"q1": 0, "q2": 0, "q3": 0, "q4": 0},
        "year3": {"q1": 0, "q2": 0, "q3": 0, "q4": 0}
      },
      "breakEven": {
        "monthlyBreakEven": 0,
        "breakEvenMonth": "Month X",
        "breakEvenRevenue": 0
      },
      "unitEconomics": {
        "customerAcquisitionCost": 0,
        "lifetimeValue": 0,
        "grossMargin": 0,
        "paybackPeriod": 0
      },
      "fundingRequirements": {
        "totalNeeded": 0,
        "runway": "X months",
        "milestones": ["Milestone 1", "Milestone 2"]
      },
      "valuation": {
        "preMoney": 0,
        "postMoney": 0,
        "multiple": 0
      }
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse financial model response');
    } catch (error) {
      console.error('Financial Model Generation Error:', error);
      throw new Error('Failed to generate financial model');
    }
  }

  async generateMVPFeatures(idea) {
    const prompt = `
    You are a product management expert. Define MVP features for this startup idea:

    Idea: ${JSON.stringify(idea)}

    Generate:
    1. Core MVP Features (Must-have)
    2. Nice-to-have Features (Future releases)
    3. Technical Architecture
    4. Development Timeline
    5. Resource Requirements

    Return as JSON:
    {
      "mvpFeatures": [
        {
          "feature": "Feature name",
          "description": "Feature description",
          "priority": "High/Medium/Low",
          "effort": "Small/Medium/Large",
          "userStory": "As a user, I want..."
        }
      ],
      "futureFeatures": [
        {
          "feature": "Feature name",
          "description": "Feature description",
          "release": "v2.0/v3.0"
        }
      ],
      "technicalArchitecture": {
        "frontend": "Technology stack",
        "backend": "Technology stack",
        "database": "Database choice",
        "infrastructure": "Hosting/cloud",
        "integrations": ["Integration 1", "Integration 2"]
      },
      "developmentTimeline": {
        "phase1": {"duration": "X weeks", "features": ["Feature 1", "Feature 2"]},
        "phase2": {"duration": "X weeks", "features": ["Feature 3", "Feature 4"]}
      },
      "resourceRequirements": {
        "team": ["Role 1", "Role 2"],
        "budget": "Development budget",
        "timeline": "Total timeline"
      }
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse MVP features response');
    } catch (error) {
      console.error('MVP Features Generation Error:', error);
      throw new Error('Failed to generate MVP features');
    }
  }

  async generateCode(idea, mvpFeatures, techStack = 'React/Node.js') {
    const prompt = `
    You are a senior full-stack developer. Generate starter code for this startup idea:

    Idea: ${JSON.stringify(idea)}
    MVP Features: ${JSON.stringify(mvpFeatures)}
    Tech Stack: ${techStack}

    Generate:
    1. Project structure
    2. Core components
    3. API endpoints
    4. Database schema
    5. Configuration files

    Focus on:
    - Clean, production-ready code
    - Best practices
    - Scalability
    - Security
    - Documentation

    Return as JSON with file structure:
    {
      "projectStructure": {
        "frontend": {
          "src/components/": ["Component1.jsx", "Component2.jsx"],
          "src/pages/": ["Page1.jsx", "Page2.jsx"],
          "src/utils/": ["api.js", "auth.js"]
        },
        "backend": {
          "src/routes/": ["auth.js", "api.js"],
          "src/models/": ["User.js", "Product.js"],
          "src/middleware/": ["auth.js", "validation.js"]
        }
      },
      "codeFiles": {
        "package.json": "package.json content",
        "README.md": "README content",
        "src/components/App.jsx": "React component code",
        "src/routes/auth.js": "Express route code"
      },
      "deployment": {
        "dockerfile": "Docker configuration",
        "docker-compose.yml": "Docker compose",
        "deployment-guide.md": "Deployment instructions"
      }
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse code generation response');
    } catch (error) {
      console.error('Code Generation Error:', error);
      throw new Error('Failed to generate code');
    }
  }

  async simulateInvestorPitch(pitchDeck, userContext) {
    const prompt = `
    You are an experienced investor. Simulate a pitch session for this startup:

    Pitch Deck: ${JSON.stringify(pitchDeck)}
    User Context: ${JSON.stringify(userContext)}

    Provide:
    1. Investor feedback
    2. Common questions
    3. Concerns and risks
    4. Suggestions for improvement
    5. Investment decision simulation

    Return as JSON:
    {
      "feedback": {
        "strengths": ["Strength 1", "Strength 2"],
        "weaknesses": ["Weakness 1", "Weakness 2"],
        "overallScore": 8.5,
        "recommendation": "Invest/Pass/Maybe"
      },
      "questions": [
        {
          "question": "Question text",
          "category": "Market/Team/Financial/Technical",
          "difficulty": "Easy/Medium/Hard"
        }
      ],
      "concerns": [
        {
          "concern": "Concern description",
          "severity": "High/Medium/Low",
          "mitigation": "How to address"
        }
      ],
      "suggestions": [
        "Suggestion 1",
        "Suggestion 2"
      ],
      "investmentDecision": {
        "decision": "Invest/Pass/Follow-up",
        "amount": "Investment amount",
        "terms": "Investment terms",
        "reasoning": "Decision reasoning"
      }
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse investor simulation response');
    } catch (error) {
      console.error('Investor Simulation Error:', error);
      throw new Error('Failed to simulate investor pitch');
    }
  }

  async generateLearningPath(userRole, interests, currentSkills = []) {
    const prompt = `
    You are a startup education expert. Create a personalized learning path for this user:

    Role: ${userRole}
    Interests: ${JSON.stringify(interests)}
    Current Skills: ${JSON.stringify(currentSkills)}

    Generate a comprehensive learning path including:

    1. Learning objectives
    2. Course recommendations
    3. Reading list
    4. Podcast recommendations
    5. Skill assessments
    6. Timeline
    7. Milestones

    Return as JSON:
    {
      "learningObjectives": ["Objective 1", "Objective 2"],
      "courses": [
        {
          "title": "Course title",
          "provider": "Provider name",
          "duration": "Duration",
          "difficulty": "Beginner/Intermediate/Advanced",
          "url": "Course URL",
          "description": "Course description"
        }
      ],
      "readingList": [
        {
          "title": "Book/Article title",
          "author": "Author",
          "type": "Book/Article/Blog",
          "url": "URL if available",
          "description": "Description"
        }
      ],
      "podcasts": [
        {
          "title": "Podcast title",
          "host": "Host name",
          "episodes": ["Episode 1", "Episode 2"],
          "description": "Description"
        }
      ],
      "skillAssessments": [
        {
          "skill": "Skill name",
          "assessment": "Assessment description",
          "resources": ["Resource 1", "Resource 2"]
        }
      ],
      "timeline": {
        "week1-2": ["Task 1", "Task 2"],
        "week3-4": ["Task 3", "Task 4"]
      },
      "milestones": [
        {
          "milestone": "Milestone name",
          "timeline": "Timeline",
          "description": "Description"
        }
      ]
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse learning path response');
    } catch (error) {
      console.error('Learning Path Generation Error:', error);
      throw new Error('Failed to generate learning path');
    }
  }

  async generateColdEmailTemplate(recipientType, startupInfo, purpose) {
    const prompt = `
    You are an expert in business communication. Generate a cold email template for this purpose:

    Recipient Type: ${recipientType} (investor/mentor/customer/partner)
    Startup Info: ${JSON.stringify(startupInfo)}
    Purpose: ${purpose}

    Create a professional, personalized cold email template including:

    1. Subject line
    2. Opening
    3. Value proposition
    4. Call to action
    5. Closing

    Return as JSON:
    {
      "subject": "Email subject line",
      "template": "Full email template",
      "personalizationTips": ["Tip 1", "Tip 2"],
      "followUpTemplate": "Follow-up email template",
      "bestPractices": ["Practice 1", "Practice 2"]
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse cold email response');
    } catch (error) {
      console.error('Cold Email Generation Error:', error);
      throw new Error('Failed to generate cold email template');
    }
  }

  parseStructuredResponse(text) {
    // Fallback parser for when JSON parsing fails
    const ideas = [];
    const sections = text.split(/\d+\./);
    
    sections.forEach((section, index) => {
      if (section.trim() && index > 0) {
        const lines = section.trim().split('\n');
        const title = lines[0]?.replace(/[:\-]/g, '').trim();
        if (title) {
          ideas.push({
            id: Date.now() + Math.random(),
            title: title,
            description: lines.slice(1).join(' ').substring(0, 200) + '...',
            problem: 'Problem to be analyzed',
            solution: 'Solution to be developed',
            targetAudience: 'Target audience to be defined',
            revenueModel: 'Revenue model to be determined',
            marketSize: 'Market size to be researched',
            growthRate: 'Growth rate to be analyzed',
            category: 'Category to be determined',
            differentiators: ['Differentiator 1', 'Differentiator 2'],
            feasibility: 'Medium',
            investmentNeeded: 'To be determined'
          });
        }
      }
    });
    
    return ideas.slice(0, 3);
  }
}

export default new AIService();
