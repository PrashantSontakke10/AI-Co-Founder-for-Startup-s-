import mongoose from 'mongoose';

const InvestorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firm: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['angel', 'vc', 'accelerator', 'corporate', 'family-office'],
    required: true
  },
  stage: [{ 
    type: String, 
    enum: ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth', 'late-stage']
  }],
  industries: [{ type: String }],
  location: {
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    region: { type: String, default: '' }
  },
  investmentRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' }
  },
  portfolio: [{
    company: { type: String, required: true },
    industry: { type: String, default: '' },
    stage: { type: String, default: '' },
    year: { type: Number }
  }],
  contact: {
    email: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  preferences: {
    investmentThesis: { type: String, default: '' },
    dealFlow: { type: String, default: '' },
    dueDiligence: { type: String, default: '' },
    boardParticipation: { type: String, default: '' }
  },
  reputation: {
    rating: { type: Number, min: 1, max: 5, default: 0 },
    reviews: [{ 
      founder: { type: String, required: true },
      company: { type: String, required: true },
      rating: { type: Number, min: 1, max: 5 },
      review: { type: String, default: '' },
      date: { type: Date, default: Date.now }
    }],
    averageResponseTime: { type: String, default: '' },
    successRate: { type: Number, default: 0 }
  },
  lastUpdated: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Investor || mongoose.model('Investor', InvestorSchema);
