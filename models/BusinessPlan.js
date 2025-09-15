import mongoose from 'mongoose';

const BusinessPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ideaId: { type: String, required: true },
  title: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'in-progress', 'completed', 'archived'],
    default: 'draft'
  },
  executiveSummary: { type: String, default: '' },
  marketAnalysis: {
    marketSize: { type: String, default: '' },
    targetMarket: { type: String, default: '' },
    marketTrends: [{ type: String }],
    customerSegments: [{ type: String }]
  },
  competitiveAnalysis: {
    directCompetitors: [{ type: String }],
    indirectCompetitors: [{ type: String }],
    competitiveAdvantages: [{ type: String }]
  },
  businessModelCanvas: {
    keyPartners: [{ type: String }],
    keyActivities: [{ type: String }],
    keyResources: [{ type: String }],
    valuePropositions: [{ type: String }],
    customerRelationships: [{ type: String }],
    channels: [{ type: String }],
    customerSegments: [{ type: String }],
    costStructure: [{ type: String }],
    revenueStreams: [{ type: String }]
  },
  financialProjections: {
    year1: { revenue: { type: Number, default: 0 }, expenses: { type: Number, default: 0 }, profit: { type: Number, default: 0 } },
    year2: { revenue: { type: Number, default: 0 }, expenses: { type: Number, default: 0 }, profit: { type: Number, default: 0 } },
    year3: { revenue: { type: Number, default: 0 }, expenses: { type: Number, default: 0 }, profit: { type: Number, default: 0 } }
  },
  marketingStrategy: {
    channels: [{ type: String }],
    budget: { type: String, default: '' },
    metrics: [{ type: String }]
  },
  operationsPlan: {
    team: [{ type: String }],
    infrastructure: [{ type: String }],
    processes: [{ type: String }]
  },
  riskAnalysis: {
    risks: [{ type: String }],
    mitigation: [{ type: String }]
  },
  fundingRequirements: {
    amount: { type: String, default: '' },
    useOfFunds: [{ type: String }],
    fundingRounds: [{ type: String }]
  },
  milestones: [{
    timeline: { type: String, required: true },
    milestone: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }],
  lastModified: { type: Date, default: Date.now },
  version: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.models.BusinessPlan || mongoose.model('BusinessPlan', BusinessPlanSchema);
