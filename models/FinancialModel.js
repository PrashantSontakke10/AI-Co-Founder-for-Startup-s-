import mongoose from 'mongoose';

const FinancialModelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessPlan' },
  title: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'in-progress', 'completed', 'validated'],
    default: 'draft'
  },
  revenueProjections: {
    year1: { type: Map, of: Number, default: {} },
    year2: { type: Map, of: Number, default: {} },
    year3: { type: Map, of: Number, default: {} }
  },
  costStructure: {
    fixedCosts: {
      salaries: { type: Number, default: 0 },
      rent: { type: Number, default: 0 },
      utilities: { type: Number, default: 0 },
      insurance: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    },
    variableCosts: {
      marketing: { type: Number, default: 0 },
      production: { type: Number, default: 0 },
      support: { type: Number, default: 0 },
      sales: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    }
  },
  cashFlow: {
    year1: { type: Map, of: Number, default: {} },
    year2: { type: Map, of: Number, default: {} },
    year3: { type: Map, of: Number, default: {} }
  },
  breakEven: {
    monthlyBreakEven: { type: Number, default: 0 },
    breakEvenMonth: { type: String, default: '' },
    breakEvenRevenue: { type: Number, default: 0 }
  },
  unitEconomics: {
    customerAcquisitionCost: { type: Number, default: 0 },
    lifetimeValue: { type: Number, default: 0 },
    grossMargin: { type: Number, default: 0 },
    paybackPeriod: { type: Number, default: 0 }
  },
  fundingRequirements: {
    totalNeeded: { type: Number, default: 0 },
    runway: { type: String, default: '' },
    milestones: [{ type: String }]
  },
  valuation: {
    preMoney: { type: Number, default: 0 },
    postMoney: { type: Number, default: 0 },
    multiple: { type: Number, default: 0 }
  },
  assumptions: [{
    category: { type: String, required: true },
    assumption: { type: String, required: true },
    value: { type: Number, required: true },
    confidence: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' }
  }],
  scenarios: {
    optimistic: { type: Map, of: Number, default: {} },
    realistic: { type: Map, of: Number, default: {} },
    pessimistic: { type: Map, of: Number, default: {} }
  },
  lastUpdated: { type: Date, default: Date.now },
  version: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.models.FinancialModel || mongoose.model('FinancialModel', FinancialModelSchema);
