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
      
      // Create comprehensive fallback based on user interests and role
      const userRole = role || 'entrepreneur';
      const userInterests = interests || [];
      const userSkills = currentSkills || [];
      
      // Generate relevant content based on interests
      const generateContentByInterests = (interests) => {
        const contentMap = {
          'Product Management': {
            courses: [
              { title: 'Product Management Fundamentals', provider: 'Coursera', duration: '6 weeks', difficulty: 'beginner', description: 'Learn core PM principles and methodologies' },
              { title: 'Agile Product Management', provider: 'Udemy', duration: '4 weeks', difficulty: 'intermediate', description: 'Master agile frameworks for product development' },
              { title: 'Data-Driven Product Decisions', provider: 'edX', duration: '8 weeks', difficulty: 'intermediate', description: 'Use analytics to drive product strategy' }
            ],
            books: [
              { title: 'Inspired: How to Create Tech Products Customers Love', author: 'Marty Cagan', type: 'book', description: 'Essential guide to product management' },
              { title: 'The Lean Product Playbook', author: 'Dan Olsen', type: 'book', description: 'Practical framework for product-market fit' }
            ],
            skills: ['User Research', 'Product Strategy', 'Stakeholder Management', 'Data Analysis']
          },
          'Marketing': {
            courses: [
              { title: 'Digital Marketing Specialization', provider: 'Coursera', duration: '12 weeks', difficulty: 'beginner', description: 'Comprehensive digital marketing course' },
              { title: 'Growth Hacking Masterclass', provider: 'Udemy', duration: '6 weeks', difficulty: 'intermediate', description: 'Learn viral growth strategies' },
              { title: 'Content Marketing Strategy', provider: 'HubSpot Academy', duration: '4 weeks', difficulty: 'beginner', description: 'Build effective content marketing campaigns' }
            ],
            books: [
              { title: 'Traction: How Any Startup Can Achieve Explosive Customer Growth', author: 'Gabriel Weinberg', type: 'book', description: '19 channels to get customers' },
              { title: 'Hacking Growth', author: 'Sean Ellis', type: 'book', description: 'How today\'s fastest-growing companies drive breakout success' }
            ],
            skills: ['SEO/SEM', 'Social Media Marketing', 'Email Marketing', 'Analytics', 'A/B Testing']
          },
          'Sales': {
            courses: [
              { title: 'Sales Fundamentals', provider: 'LinkedIn Learning', duration: '3 weeks', difficulty: 'beginner', description: 'Master the basics of professional selling' },
              { title: 'B2B Sales Strategy', provider: 'Salesforce Trailhead', duration: '5 weeks', difficulty: 'intermediate', description: 'Advanced B2B sales techniques' },
              { title: 'Sales Psychology', provider: 'Udemy', duration: '4 weeks', difficulty: 'intermediate', description: 'Understand buyer psychology and decision-making' }
            ],
            books: [
              { title: 'SPIN Selling', author: 'Neil Rackham', type: 'book', description: 'Revolutionary sales methodology' },
              { title: 'The Challenger Sale', author: 'Matthew Dixon', type: 'book', description: 'Taking control of the customer conversation' }
            ],
            skills: ['Prospecting', 'Qualification', 'Objection Handling', 'Closing', 'CRM Management']
          },
          'Finance': {
            courses: [
              { title: 'Financial Modeling for Startups', provider: 'Udemy', duration: '8 weeks', difficulty: 'intermediate', description: 'Build financial models for your startup' },
              { title: 'Startup Finance Fundamentals', provider: 'Coursera', duration: '6 weeks', difficulty: 'beginner', description: 'Essential finance concepts for entrepreneurs' },
              { title: 'Valuation and Fundraising', provider: 'Y Combinator', duration: '4 weeks', difficulty: 'advanced', description: 'Learn startup valuation and fundraising' }
            ],
            books: [
              { title: 'Venture Deals', author: 'Brad Feld', type: 'book', description: 'Be smarter than your lawyer and venture capitalist' },
              { title: 'Financial Intelligence for Entrepreneurs', author: 'Karen Berman', type: 'book', description: 'What you really need to know about the numbers' }
            ],
            skills: ['Financial Modeling', 'Valuation', 'Fundraising', 'Financial Planning', 'Investor Relations']
          },
          'Technology': {
            courses: [
              { title: 'Full-Stack Development', provider: 'freeCodeCamp', duration: '20 weeks', difficulty: 'beginner', description: 'Learn complete web development' },
              { title: 'Cloud Architecture', provider: 'AWS Training', duration: '10 weeks', difficulty: 'intermediate', description: 'Design scalable cloud solutions' },
              { title: 'Data Science for Business', provider: 'Coursera', duration: '8 weeks', difficulty: 'intermediate', description: 'Apply data science to business problems' }
            ],
            books: [
              { title: 'Clean Code', author: 'Robert Martin', type: 'book', description: 'A handbook of agile software craftsmanship' },
              { title: 'The Phoenix Project', author: 'Gene Kim', type: 'book', description: 'A novel about IT, DevOps, and helping your business win' }
            ],
            skills: ['Programming', 'System Design', 'DevOps', 'Data Analysis', 'Security']
          },
          'Leadership': {
            courses: [
              { title: 'Leadership Principles', provider: 'Harvard Business School', duration: '6 weeks', difficulty: 'intermediate', description: 'Develop your leadership style' },
              { title: 'Team Management', provider: 'LinkedIn Learning', duration: '4 weeks', difficulty: 'beginner', description: 'Build and lead effective teams' },
              { title: 'Strategic Thinking', provider: 'Wharton Online', duration: '8 weeks', difficulty: 'advanced', description: 'Master strategic decision-making' }
            ],
            books: [
              { title: 'Good to Great', author: 'Jim Collins', type: 'book', description: 'Why some companies make the leap and others don\'t' },
              { title: 'The Lean Startup', author: 'Eric Ries', type: 'book', description: 'How today\'s entrepreneurs use continuous innovation' }
            ],
            skills: ['Team Building', 'Strategic Planning', 'Communication', 'Decision Making', 'Change Management']
          }
        };
        
        let allCourses = [];
        let allBooks = [];
        let allSkills = [];
        
        interests.forEach(interest => {
          const content = contentMap[interest];
          if (content) {
            allCourses = allCourses.concat(content.courses);
            allBooks = allBooks.concat(content.books);
            allSkills = allSkills.concat(content.skills);
          }
        });
        
        // If no specific interests, provide general entrepreneurship content
        if (interests.length === 0) {
          allCourses = [
            { title: 'Entrepreneurship Specialization', provider: 'Coursera', duration: '16 weeks', difficulty: 'beginner', description: 'Complete entrepreneurship program' },
            { title: 'Startup School', provider: 'Y Combinator', duration: '10 weeks', difficulty: 'beginner', description: 'Free online course for entrepreneurs' },
            { title: 'Business Model Innovation', provider: 'Coursera', duration: '6 weeks', difficulty: 'intermediate', description: 'Design innovative business models' }
          ];
          allBooks = [
            { title: 'The Lean Startup', author: 'Eric Ries', type: 'book', description: 'How today\'s entrepreneurs use continuous innovation' },
            { title: 'Zero to One', author: 'Peter Thiel', type: 'book', description: 'Notes on startups, or how to build the future' },
            { title: 'The Hard Thing About Hard Things', author: 'Ben Horowitz', type: 'book', description: 'Building a business when there are no easy answers' }
          ];
          allSkills = ['Business Planning', 'Market Research', 'Financial Planning', 'Team Building', 'Strategic Thinking'];
        }
        
        return {
          courses: allCourses.slice(0, 6), // Limit to 6 courses
          books: allBooks.slice(0, 8), // Limit to 8 books
          skills: [...new Set(allSkills)].slice(0, 10) // Remove duplicates and limit to 10
        };
      };
      
      const content = generateContentByInterests(userInterests);
      
      learningPathData = {
        learningObjectives: [
          `Master ${userInterests.length > 0 ? userInterests.join(' and ') : 'entrepreneurship'} fundamentals`,
          'Develop practical business skills',
          'Build a strong professional network',
          'Create actionable business strategies',
          'Learn from successful entrepreneurs'
        ],
        courses: content.courses,
        readingList: content.books,
        podcasts: [
          { title: 'How I Built This', host: 'Guy Raz', description: 'Stories of successful entrepreneurs and how they built their companies' },
          { title: 'Masters of Scale', host: 'Reid Hoffman', description: 'Lessons from the world\'s most successful entrepreneurs' },
          { title: 'The Tim Ferriss Show', host: 'Tim Ferriss', description: 'Interviews with world-class performers' },
          { title: 'Startup Stories', host: 'Various', description: 'Real stories from startup founders' }
        ],
        skillAssessments: content.skills.map(skill => ({
          skill: skill,
          assessment: `Demonstrate proficiency in ${skill.toLowerCase()}`,
          resources: [`${skill} best practices`, `${skill} case studies`, `${skill} tools and frameworks`]
        })),
        timeline: {
          week1_2: [
            'Complete foundational course',
            'Read first recommended book',
            'Join relevant online communities',
            'Set up learning tracking system'
          ],
          week3_4: [
            'Practice skills with real projects',
            'Connect with mentors in your field',
            'Start building your professional network',
            'Begin skill assessment projects'
          ],
          week5_8: [
            'Complete intermediate courses',
            'Apply learnings to real business scenarios',
            'Seek feedback from industry experts',
            'Document your learning journey'
          ],
          week9_12: [
            'Complete advanced topics',
            'Build portfolio of work',
            'Mentor others in your learning areas',
            'Plan next learning phase'
          ]
        },
        milestones: [
          {
            milestone: 'Complete foundational learning',
            timeline: 'Month 1',
            description: 'Master basic concepts and terminology'
          },
          {
            milestone: 'Apply knowledge to real projects',
            timeline: 'Month 2',
            description: 'Use your new skills in practical scenarios'
          },
          {
            milestone: 'Build professional network',
            timeline: 'Month 3',
            description: 'Connect with 20+ professionals in your field'
          },
          {
            milestone: 'Create portfolio of work',
            timeline: 'Month 4',
            description: 'Showcase your skills with concrete examples'
          }
        ]
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


