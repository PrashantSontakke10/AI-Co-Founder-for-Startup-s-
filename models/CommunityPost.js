import mongoose from 'mongoose';

const CommunityPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['question', 'advice', 'experience', 'resource', 'announcement', 'discussion'],
    required: true
  },
  tags: [{ type: String }],
  status: { 
    type: String, 
    enum: ['open', 'answered', 'closed', 'archived'],
    default: 'open'
  },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  replies: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    isExpert: { type: Boolean, default: false },
    isAccepted: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  }],
  expertReplies: [{ 
    expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    expertise: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
  }],
  isPinned: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  lastActivity: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.CommunityPost || mongoose.model('CommunityPost', CommunityPostSchema);
