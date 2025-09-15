import connectToDB from '../../../utils/db';
import LearningPath from '../../../models/LearningPath';
import aiService from '../../../src/utils/aiService';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDB();
    
    const { userId, role, interests, currentSkills, title } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // If no userId provided, use a default or generate one
    const finalUserId = userId || new mongoose.Types.ObjectId().toString();

    // Generate learning path using AI (with error handling)
    let learningPathData = {};
    try {
      learningPathData = await aiService.generateLearningPath(role || 'entrepreneur', interests || [], currentSkills || []);
    } catch (aiError) {
      console.error('AI Service Error:', aiError);
      // Fallback data if AI service fails
      learningPathData = {
        learningObjectives: ['Learn fundamental business concepts', 'Develop entrepreneurial skills'],
        courses: [{
          title: 'Introduction to Entrepreneurship',
          provider: 'Online Platform',
          duration: '4 weeks',
          difficulty: 'beginner',
          description: 'Basic entrepreneurship course'
        }],
        readingList: [{
          title: 'The Lean Startup',
          author: 'Eric Ries',
          type: 'book',
          description: 'Essential reading for entrepreneurs'
        }],
        podcasts: [{
          title: 'Startup Stories',
          host: 'Various',
          description: 'Learn from successful entrepreneurs'
        }],
        skillAssessments: [{
          skill: 'Business Planning',
          assessment: 'Create a basic business plan',
          resources: ['Business plan templates', 'Financial modeling guides']
        }],
        timeline: {
          week1_2: ['Complete business fundamentals course', 'Read The Lean Startup'],
          week3_4: ['Practice business planning', 'Join entrepreneur community']
        },
        milestones: [{
          milestone: 'Complete first business plan',
          timeline: 'Month 1',
          description: 'Create a comprehensive business plan for your idea'
        }]
      };
    }

    // Transform and validate data to match schema
    const transformCourses = (courses) => {
      return (courses || []).map(course => ({
        title: course.title || 'Untitled Course',
        provider: course.provider || 'Unknown Provider',
        duration: course.duration || '',
        difficulty: (course.difficulty || 'beginner').toLowerCase(),
        url: course.url || '',
        description: course.description || '',
        completed: false,
        progress: 0
      }));
    };

    const transformReadingList = (readingList) => {
      return (readingList || []).map(item => {
        let type = (item.type || 'book').toLowerCase();
        // Map common variations to valid enum values
        if (type === 'articles' || type === 'article') type = 'article';
        if (type === 'books' || type === 'book') type = 'book';
        if (type === 'blogs' || type === 'blog') type = 'blog';
        if (type === 'research' || type === 'research paper') type = 'research';
        
        return {
          title: item.title || 'Untitled',
          author: item.author || '',
          type: type,
          url: item.url || '',
          description: item.description || '',
          completed: false,
          progress: 0
        };
      });
    };

    const transformPodcasts = (podcasts) => {
      return (podcasts || []).map(podcast => ({
        title: podcast.title || 'Untitled Podcast',
        host: podcast.host || '',
        description: podcast.description || '',
        episodes: Array.isArray(podcast.episodes) ? podcast.episodes.map(ep => ({
          title: typeof ep === 'string' ? ep : (ep.title || 'Untitled Episode'),
          url: typeof ep === 'object' ? (ep.url || '') : '',
          completed: false
        })) : []
      }));
    };

    const transformSkillAssessments = (assessments) => {
      return (assessments || []).map(assessment => ({
        skill: assessment.skill || 'Untitled Skill',
        assessment: assessment.assessment || '',
        resources: assessment.resources || [],
        completed: false
      }));
    };

    const transformMilestones = (milestones) => {
      return (milestones || []).map(milestone => ({
        milestone: milestone.milestone || 'Untitled Milestone',
        timeline: milestone.timeline || '',
        description: milestone.description || '',
        completed: false
      }));
    };

    // Create learning path in database
    const learningPath = new LearningPath({
      userId: finalUserId,
      title,
      learningObjectives: learningPathData.learningObjectives || [],
      courses: transformCourses(learningPathData.courses),
      readingList: transformReadingList(learningPathData.readingList),
      podcasts: transformPodcasts(learningPathData.podcasts),
      skillAssessments: transformSkillAssessments(learningPathData.skillAssessments),
      timeline: learningPathData.timeline || {},
      milestones: transformMilestones(learningPathData.milestones),
      status: 'active'
    });

    await learningPath.save();

    res.status(201).json({
      success: true,
      learningPath,
      message: 'Learning path created successfully'
    });

  } catch (error) {
    console.error('Learning path creation error:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}


