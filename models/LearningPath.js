import mongoose from 'mongoose';

const LearningPathSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'paused', 'completed', 'archived'],
    default: 'active'
  },
  learningObjectives: [{ type: String }],
  courses: [{
    title: { type: String, required: true },
    provider: { type: String, required: true },
    duration: { type: String, default: '' },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    url: { type: String, default: '' },
    description: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    rating: { type: Number, min: 1, max: 5 }
  }],
  readingList: [{
    title: { type: String, required: true },
    author: { type: String, default: '' },
    type: { type: String, enum: ['book', 'article', 'blog', 'research'], default: 'book' },
    url: { type: String, default: '' },
    description: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
    rating: { type: Number, min: 1, max: 5 }
  }],
  podcasts: [{
    title: { type: String, required: true },
    host: { type: String, default: '' },
    episodes: [{ 
      title: { type: String, required: true },
      url: { type: String, default: '' },
      completed: { type: Boolean, default: false },
      rating: { type: Number, min: 1, max: 5 }
    }],
    description: { type: String, default: '' }
  }],
  skillAssessments: [{
    skill: { type: String, required: true },
    assessment: { type: String, required: true },
    resources: [{ type: String }],
    completed: { type: Boolean, default: false },
    score: { type: Number, min: 0, max: 100 },
    lastAttempted: { type: Date }
  }],
  timeline: {
    week1_2: [{ type: String }],
    week3_4: [{ type: String }],
    week5_6: [{ type: String }],
    week7_8: [{ type: String }],
    week9_10: [{ type: String }],
    week11_12: [{ type: String }]
  },
  milestones: [{
    milestone: { type: String, required: true },
    timeline: { type: String, required: true },
    description: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    completedDate: { type: Date }
  }],
  progress: {
    overallProgress: { type: Number, default: 0 },
    coursesCompleted: { type: Number, default: 0 },
    booksRead: { type: Number, default: 0 },
    skillsAssessed: { type: Number, default: 0 },
    milestonesReached: { type: Number, default: 0 }
  },
  startDate: { type: Date, default: Date.now },
  targetCompletionDate: { type: Date },
  actualCompletionDate: { type: Date },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.LearningPath || mongoose.model('LearningPath', LearningPathSchema);
