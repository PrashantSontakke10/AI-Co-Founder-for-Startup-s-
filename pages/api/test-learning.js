import connectToDB from '../../utils/db';
import LearningPath from '../../models/LearningPath';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDB();
    
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Create a simple learning path without AI
    const learningPath = new LearningPath({
      userId: new mongoose.Types.ObjectId(),
      title,
      learningObjectives: ['Test objective'],
      courses: [{
        title: 'Test Course',
        provider: 'Test Provider',
        duration: '1 week',
        difficulty: 'beginner',
        description: 'Test course description'
      }],
      readingList: [{
        title: 'Test Book',
        author: 'Test Author',
        type: 'book',
        description: 'Test book description'
      }],
      podcasts: [{
        title: 'Test Podcast',
        host: 'Test Host',
        description: 'Test podcast description'
      }],
      skillAssessments: [{
        skill: 'Test Skill',
        assessment: 'Test assessment',
        resources: ['Test resource']
      }],
      timeline: {
        week1_2: ['Test task 1', 'Test task 2']
      },
      milestones: [{
        milestone: 'Test milestone',
        timeline: 'Week 1',
        description: 'Test milestone description'
      }],
      status: 'active'
    });

    await learningPath.save();

    res.status(201).json({
      success: true,
      learningPath,
      message: 'Test learning path created successfully'
    });

  } catch (error) {
    console.error('Test learning path creation error:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}



