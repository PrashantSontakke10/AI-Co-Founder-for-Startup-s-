import mongoose from 'mongoose';

const PitchDeckSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessPlan' },
  title: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'in-progress', 'completed', 'presented'],
    default: 'draft'
  },
  slides: [{
    slideNumber: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    visuals: { type: String, default: '' },
    notes: { type: String, default: '' },
    order: { type: Number, default: 0 }
  }],
  presentationSettings: {
    theme: { type: String, default: 'modern' },
    colorScheme: { type: String, default: 'blue' },
    font: { type: String, default: 'Arial' }
  },
  feedback: [{
    reviewer: { type: String, required: true },
    rating: { type: Number, min: 1, max: 10 },
    comments: { type: String, default: '' },
    suggestions: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
  presentationCount: { type: Number, default: 0 },
  lastPresented: { type: Date },
  version: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.models.PitchDeck || mongoose.model('PitchDeck', PitchDeckSchema);
