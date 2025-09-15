import mongoose from 'mongoose';

const CompetitorEventSchema = new mongoose.Schema({
  source: { type: String, required: true },
  competitorName: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  summary: { type: String, default: '' },
  publishedAt: { type: Date, required: true },
  hash: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.CompetitorEvent || mongoose.model('CompetitorEvent', CompetitorEventSchema);


