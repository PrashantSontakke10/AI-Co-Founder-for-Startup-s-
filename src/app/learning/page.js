'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '../../components/AuthGuard';
import { getUserInfo } from '../../utils/auth';
import { motion } from 'framer-motion';

export default function Learning() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('path');
  const [learningPath, setLearningPath] = useState(null);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pathForm, setPathForm] = useState({
    interests: [],
    currentSkills: [],
    goals: ''
  });
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'question'
  });
  const router = useRouter();

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  const generateLearningPath = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/learning-path/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?._id,
          role: user?.role,
          interests: pathForm.interests,
          currentSkills: pathForm.currentSkills,
          title: `Personalized Learning Path for ${user?.profile?.firstName || 'User'}`
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setLearningPath(data.learningPath);
        setActiveTab('path');
      } else {
        throw new Error(data.message || 'Failed to generate learning path');
      }
    } catch (error) {
      console.error('Error generating learning path:', error);
      alert('Failed to generate learning path. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadSampleCommunityPosts = () => {
    setCommunityPosts([
      {
        id: 1,
        title: "How to validate a startup idea before building?",
        content: "I have an idea for a SaaS product but I'm not sure if there's a real market need. What are the best ways to validate before investing time and money?",
        category: "question",
        author: "Sarah Chen",
        replies: 12,
        likes: 8,
        createdAt: "2 hours ago"
      },
      {
        id: 2,
        title: "My experience raising a seed round",
        content: "Just closed our $2M seed round after 6 months of pitching. Here's what I learned about the process, common mistakes, and what investors really care about...",
        category: "experience",
        author: "Mike Rodriguez",
        replies: 25,
        likes: 45,
        createdAt: "1 day ago"
      },
      {
        id: 3,
        title: "Best resources for learning product management",
        category: "resource",
        content: "Curated list of books, courses, and tools that helped me transition from engineering to product management. Includes both free and paid resources.",
        author: "Alex Kim",
        replies: 7,
        likes: 23,
        createdAt: "3 days ago"
      }
    ]);
  };

  useEffect(() => {
    loadSampleCommunityPosts();
  }, []);

  const interestOptions = [
    'Product Management', 'Marketing', 'Sales', 'Finance', 'Operations',
    'Technology', 'Design', 'Leadership', 'Fundraising', 'Strategy'
  ];

  const skillOptions = [
    'Beginner', 'Intermediate', 'Advanced', 'Expert'
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation */}
        <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI CoFounder
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">
                  Welcome, {user?.profile?.firstName || 'User'}!
                </span>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-purple-500/20 border border-purple-500/50 text-purple-300 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition-colors"
                >
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              🎓 Learning & Mentorship
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Personalized learning paths, expert mentorship, and a supportive community of entrepreneurs
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-8">
            <button
              onClick={() => setActiveTab('path')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                activeTab === 'path'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              📚 Learning Path
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                activeTab === 'community'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              💬 Community
            </button>
            <button
              onClick={() => setActiveTab('mentorship')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                activeTab === 'mentorship'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              👥 Mentorship
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'path' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {!learningPath ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-6">Create Your Learning Path</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-3">Areas of Interest</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {interestOptions.map((interest) => (
                          <button
                            key={interest}
                            onClick={() => {
                              setPathForm(prev => ({
                                ...prev,
                                interests: prev.interests.includes(interest)
                                  ? prev.interests.filter(i => i !== interest)
                                  : [...prev.interests, interest]
                              }));
                            }}
                            className={`p-3 rounded-lg border transition-all duration-300 ${
                              pathForm.interests.includes(interest)
                                ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                                : 'bg-white/5 border-white/10 text-gray-300 hover:border-purple-400/50'
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-3">Current Skill Level</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {skillOptions.map((skill) => (
                          <button
                            key={skill}
                            onClick={() => {
                              setPathForm(prev => ({
                                ...prev,
                                currentSkills: prev.currentSkills.includes(skill)
                                  ? prev.currentSkills.filter(s => s !== skill)
                                  : [...prev.currentSkills, skill]
                              }));
                            }}
                            className={`p-3 rounded-lg border transition-all duration-300 ${
                              pathForm.currentSkills.includes(skill)
                                ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                                : 'bg-white/5 border-white/10 text-gray-300 hover:border-purple-400/50'
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Learning Goals</label>
                      <textarea
                        value={pathForm.goals}
                        onChange={(e) => setPathForm(prev => ({ ...prev, goals: e.target.value }))}
                        placeholder="What do you want to achieve? What skills do you want to develop?"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white h-24"
                      />
                    </div>

                    <button
                      onClick={generateLearningPath}
                      disabled={isGenerating || pathForm.interests.length === 0}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isGenerating ? 'Generating...' : 'Generate Learning Path'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">Your Learning Path</h3>
                    <button
                      onClick={() => setLearningPath(null)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Learning Objectives</h4>
                      <ul className="space-y-2">
                        {learningPath.learningObjectives?.map((objective, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                            <span className="text-gray-300">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Recommended Courses</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {learningPath.courses?.slice(0, 4).map((course, index) => (
                          <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <h5 className="font-semibold text-white mb-2">{course.title}</h5>
                            <p className="text-sm text-gray-300 mb-2">{course.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400">{course.provider}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                course.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                                course.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                              }`}>
                                {course.difficulty}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Reading List</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {learningPath.readingList?.slice(0, 4).map((book, index) => (
                          <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <h5 className="font-semibold text-white mb-2">{book.title}</h5>
                            <p className="text-sm text-gray-300 mb-2">by {book.author}</p>
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                              {book.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Timeline</h4>
                      <div className="space-y-3">
                        {Object.entries(learningPath.timeline || {}).slice(0, 4).map(([week, tasks]) => (
                          <div key={week} className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <h5 className="font-semibold text-white mb-2">{week.replace(/_/g, ' ').toUpperCase()}</h5>
                            <ul className="space-y-1">
                              {tasks.slice(0, 3).map((task, index) => (
                                <li key={index} className="text-sm text-gray-300">• {task}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'community' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* New Post Form */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Ask a Question or Share Experience</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Category</label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="question">Question</option>
                      <option value="advice">Advice</option>
                      <option value="experience">Experience</option>
                      <option value="resource">Resource</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Title</label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="What's your question or topic?"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Content</label>
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Share your thoughts, questions, or experiences..."
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white h-32"
                    />
                  </div>
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                    Post to Community
                  </button>
                </div>
              </div>

              {/* Community Posts */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Recent Community Posts</h3>
                {communityPosts.map((post) => (
                  <div key={post.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">{post.title}</h4>
                        <p className="text-gray-300 mb-3">{post.content}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        post.category === 'question' ? 'bg-blue-500/20 text-blue-300' :
                        post.category === 'experience' ? 'bg-green-500/20 text-green-300' :
                        post.category === 'resource' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {post.category}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>by {post.author}</span>
                        <span>{post.createdAt}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-400">{post.replies} replies</span>
                        <span className="text-sm text-gray-400">{post.likes} likes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'mentorship' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Expert Mentorship</h3>
                <p className="text-gray-300 mb-6">
                  Connect with experienced entrepreneurs, investors, and industry experts for personalized guidance.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Sarah Johnson",
                      title: "Former VP at Google",
                      expertise: "Product Strategy, Scaling",
                      experience: "15+ years",
                      availability: "Available",
                      rate: "$200/hour"
                    },
                    {
                      name: "Michael Chen",
                      title: "Serial Entrepreneur",
                      expertise: "Fundraising, Operations",
                      experience: "20+ years",
                      availability: "Available",
                      rate: "$150/hour"
                    },
                    {
                      name: "Lisa Rodriguez",
                      title: "Partner at TechCrunch Ventures",
                      expertise: "Investment, Due Diligence",
                      experience: "12+ years",
                      availability: "Limited",
                      rate: "$300/hour"
                    }
                  ].map((mentor, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">{mentor.name}</h4>
                      <p className="text-sm text-gray-300 mb-2">{mentor.title}</p>
                      <p className="text-sm text-gray-300 mb-2">Expertise: {mentor.expertise}</p>
                      <p className="text-sm text-gray-300 mb-2">Experience: {mentor.experience}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          mentor.availability === 'Available' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {mentor.availability}
                        </span>
                        <span className="text-sm text-gray-300">{mentor.rate}</span>
                      </div>
                      <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                        Book Session
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Office Hours</h3>
                <p className="text-gray-300 mb-4">
                  Join live Q&A sessions with industry experts. Ask questions and get real-time advice.
                </p>
                <div className="space-y-4">
                  {[
                    {
                      title: "Fundraising 101 with VC Partner",
                      expert: "David Kim",
                      time: "Tomorrow, 2:00 PM PST",
                      topic: "How to prepare for your first investor meeting"
                    },
                    {
                      title: "Product-Market Fit Workshop",
                      expert: "Emma Wilson",
                      time: "Friday, 10:00 AM PST",
                      topic: "Finding and validating product-market fit"
                    }
                  ].map((session, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">{session.title}</h4>
                      <p className="text-sm text-gray-300 mb-2">Expert: {session.expert}</p>
                      <p className="text-sm text-gray-300 mb-2">Time: {session.time}</p>
                      <p className="text-sm text-gray-300 mb-3">Topic: {session.topic}</p>
                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                        Join Session
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}















