import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  path: { type: String, default: '' },
  rating: { type: Number, min: 1, max: 5, required: false },
  comment: { type: String, default: '' },
  context: { type: Object, default: {} },
  contact: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);


