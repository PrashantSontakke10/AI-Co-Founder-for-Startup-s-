import mongoose from 'mongoose';

const MVPFeatureSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ideaId: { type: String, required: true },
  title: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['planned', 'in-development', 'completed', 'testing', 'deployed'],
    default: 'planned'
  },
  mvpFeatures: [{
    feature: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    effort: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
    userStory: { type: String, default: '' },
    acceptanceCriteria: [{ type: String }],
    estimatedHours: { type: Number, default: 0 },
    assignedTo: { type: String, default: '' },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' }
  }],
  futureFeatures: [{
    feature: { type: String, required: true },
    description: { type: String, required: true },
    release: { type: String, default: 'v2.0' },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'low' }
  }],
  technicalArchitecture: {
    frontend: { type: String, default: '' },
    backend: { type: String, default: '' },
    database: { type: String, default: '' },
    infrastructure: { type: String, default: '' },
    integrations: [{ type: String }]
  },
  developmentTimeline: {
    phase1: {
      duration: { type: String, default: '' },
      features: [{ type: String }],
      startDate: { type: Date },
      endDate: { type: Date }
    },
    phase2: {
      duration: { type: String, default: '' },
      features: [{ type: String }],
      startDate: { type: Date },
      endDate: { type: Date }
    },
    phase3: {
      duration: { type: String, default: '' },
      features: [{ type: String }],
      startDate: { type: Date },
      endDate: { type: Date }
    }
  },
  resourceRequirements: {
    team: [{ 
      role: { type: String, required: true },
      count: { type: Number, default: 1 },
      skills: [{ type: String }]
    }],
    budget: { type: Number, default: 0 },
    timeline: { type: String, default: '' }
  },
  codeGenerated: {
    hasCode: { type: Boolean, default: false },
    techStack: { type: String, default: '' },
    repository: { type: String, default: '' },
    deploymentStatus: { type: String, enum: ['not-deployed', 'staging', 'production'], default: 'not-deployed' }
  },
  lastUpdated: { type: Date, default: Date.now },
  version: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.models.MVPFeature || mongoose.model('MVPFeature', MVPFeatureSchema);
