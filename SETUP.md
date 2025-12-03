# AI CoFounder Setup Guide

## Overview
AI CoFounder is a comprehensive startup platform that provides AI-powered assistance for ideation, business planning, technical development, fundraising, and learning.

## Features Implemented

### ✅ Core Features
- **Dynamic Startup Ideation**: AI-powered idea generation with market validation
- **Business Planning**: Lean Canvas, business plans, pitch decks, financial models
- **Technical Co-Founder**: MVP feature lists, code generation, technical architecture
- **Fundraising & Networking**: Pitch simulation, investor matching, cold email templates
- **Learning & Mentorship**: Personalized learning paths, community Q&A, expert office hours
- **Real-Time Market Feedback**: Competitor tracking and trend analysis

### 🛠️ Technical Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **AI Integration**: Google AI Studio (Gemini 1.5 Flash)
- **Authentication**: JWT-based auth system
- **Database**: MongoDB with comprehensive schemas

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Google AI Studio API key

### 2. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/ai_cofounder

# Google AI Studio API Key
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# App Environment
NODE_ENV=development
```

### 3. Google AI Studio Setup
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new project
3. Generate an API key
4. Add the API key to your `.env.local` file

### 4. Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Database Setup
The application will automatically create the necessary database collections when you first run it.

## API Endpoints

### Ideation
- `POST /api/ideation/generate` - Generate startup ideas, business plans, pitch decks, etc.

### Business Planning
- `POST /api/business-plan/create` - Create business plan
- `GET /api/business-plan/list` - List user's business plans

### Technical Development
- `POST /api/mvp-features/create` - Generate MVP features
- `POST /api/code/generate` - Generate code for startup

### Fundraising
- `POST /api/investors/simulate` - Simulate investor pitch
- `POST /api/email-templates/generate` - Generate cold email templates

### Learning
- `POST /api/learning-path/create` - Create personalized learning path

## Database Models

### Core Models
- **User**: User profiles, roles, startup information
- **BusinessPlan**: Comprehensive business plans
- **PitchDeck**: Pitch deck slides and feedback
- **FinancialModel**: Financial projections and models
- **MVPFeature**: MVP features and technical architecture
- **LearningPath**: Personalized learning paths
- **Investor**: Investor database
- **CommunityPost**: Community Q&A posts

## Usage Guide

### 1. Startup Ideation
- Navigate to `/ideation`
- Chat with AI to generate startup ideas
- Analyze market potential and competitors
- Save promising ideas for further development

### 2. Business Planning
- Go to `/business-planning`
- Select an idea to develop
- Generate Lean Canvas, business plan, pitch deck, and financial model
- Iterate and refine based on AI feedback

### 3. Technical Development
- Visit `/technical-cofounder`
- Define MVP features and technical requirements
- Generate production-ready code
- Plan development timeline and resources

### 4. Fundraising
- Access `/fundraising`
- Practice pitches with AI simulation
- Generate cold email templates
- Find relevant investors

### 5. Learning & Mentorship
- Go to `/learning`
- Create personalized learning paths
- Join community discussions
- Book mentorship sessions

## AI Integration

The platform uses Google AI Studio's Gemini 1.5 Flash model for:
- Startup idea generation
- Business plan creation
- Pitch deck development
- Financial modeling
- Code generation
- Learning path creation
- Email template generation
- Investor pitch simulation

## Development

### Project Structure
```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
├── utils/              # Utility functions
└── models/             # Database models

pages/
└── api/                # API endpoints
```

### Adding New Features
1. Create new API endpoints in `pages/api/`
2. Add corresponding database models in `models/`
3. Create UI components in `src/app/`
4. Update navigation and routing

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Ensure MongoDB connection is configured
- Set all required environment variables
- Build and deploy the Next.js application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
- Check the existing issues on GitHub
- Create a new issue with detailed description
- Include error logs and environment details

## License

This project is licensed under the MIT License.















