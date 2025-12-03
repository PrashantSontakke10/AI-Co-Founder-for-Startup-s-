'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '../../components/AuthGuard';
import { getUserInfo } from '../../utils/auth';
import { motion } from 'framer-motion';

export default function TechnicalCoFounder() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('mvp');
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [mvpFeatures, setMvpFeatures] = useState(null);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [techStack, setTechStack] = useState('React/Node.js');
  const router = useRouter();

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  const generateMVPFeatures = async (idea) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/mvp-features/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?._id,
          idea: idea,
          title: `${idea.title} - MVP Features`
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMvpFeatures(data.mvpFeatures);
        setActiveTab('features');
      } else {
        throw new Error(data.message || 'Failed to generate MVP features');
      }
    } catch (error) {
      console.error('Error generating MVP features:', error);
      alert('Failed to generate MVP features. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCode = async (idea, features) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/code/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: idea,
          mvpFeatures: features,
          techStack: techStack
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedCode(data.code);
        setActiveTab('code');
      } else {
        throw new Error(data.message || 'Failed to generate code');
      }
    } catch (error) {
      console.error('Error generating code:', error);
      alert('Failed to generate code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadSampleIdeas = () => {
    setGeneratedIdeas([
      {
        id: 1,
        title: "EcoSmart Solutions",
        description: "AI-powered platform that helps businesses reduce their carbon footprint through smart resource management and sustainable practices.",
        category: "Sustainability & Green Tech",
        marketSize: "$45B",
        growthRate: "18% annually"
      },
      {
        id: 2,
        title: "HealthTech Companion",
        description: "Personalized AI health assistant providing preventive care recommendations and connecting users with healthcare providers.",
        category: "Healthcare & Wellness",
        marketSize: "$280B",
        growthRate: "25% annually"
      },
      {
        id: 3,
        title: "EduTech Mentor",
        description: "AI-powered personalized learning platform adapting to individual learning styles with real-time feedback.",
        category: "Education & Learning",
        marketSize: "$89B",
        growthRate: "20% annually"
      }
    ]);
  };

  useEffect(() => {
    loadSampleIdeas();
  }, []);

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
              ⚡ Technical Co-Founder
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Build your MVP with AI-generated features, technical architecture, and production-ready code
            </p>
          </div>

          {/* Idea Selection */}
          {!selectedIdea && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4">💡 Select Your Startup Idea</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedIdeas.map((idea) => (
                  <motion.div
                    key={idea.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedIdea(idea)}
                  >
                    <h3 className="text-xl font-bold text-white mb-2">{idea.title}</h3>
                    <p className="text-gray-300 mb-4">{idea.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                        {idea.category}
                      </span>
                      <span className="text-sm text-gray-400">{idea.marketSize}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Selected Idea & Tabs */}
          {selectedIdea && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Selected Idea Display */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedIdea.title}</h2>
                    <p className="text-gray-300 mb-4">{selectedIdea.description}</p>
                    <div className="flex space-x-4">
                      <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                        {selectedIdea.category}
                      </span>
                      <span className="text-sm bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                        {selectedIdea.marketSize}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedIdea(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-8">
                <button
                  onClick={() => setActiveTab('mvp')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'mvp'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🚀 MVP Planning
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'features'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  📋 Feature List
                </button>
                <button
                  onClick={() => setActiveTab('architecture')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'architecture'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🏗️ Architecture
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'code'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  💻 Code Generator
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'mvp' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">MVP Planning</h3>
                    <button
                      onClick={() => generateMVPFeatures(selectedIdea)}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isGenerating ? 'Generating...' : 'Generate MVP Plan'}
                    </button>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Define your Minimum Viable Product with core features, technical requirements, and development timeline.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">🎯 MVP Principles</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Focus on core value proposition</li>
                        <li>• Build only essential features</li>
                        <li>• Validate with real users quickly</li>
                        <li>• Iterate based on feedback</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">⚡ Development Approach</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Agile development methodology</li>
                        <li>• Continuous integration/deployment</li>
                        <li>• User feedback loops</li>
                        <li>• Rapid prototyping</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'features' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {mvpFeatures ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="text-2xl font-bold text-white mb-6">MVP Features</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Core MVP Features</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            {mvpFeatures.mvpFeatures?.map((feature, index) => (
                              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-semibold text-white">{feature.feature}</h5>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    feature.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                                    feature.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                    'bg-green-500/20 text-green-300'
                                  }`}>
                                    {feature.priority}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-300 mb-2">{feature.description}</p>
                                <p className="text-xs text-gray-400">Effort: {feature.effort} • Hours: {feature.estimatedHours}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Future Features</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            {mvpFeatures.futureFeatures?.map((feature, index) => (
                              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <h5 className="font-semibold text-white mb-2">{feature.feature}</h5>
                                <p className="text-sm text-gray-300 mb-2">{feature.description}</p>
                                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                                  {feature.release}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                      <div className="text-6xl mb-4">📋</div>
                      <h3 className="text-2xl font-bold text-white mb-2">No MVP Features Yet</h3>
                      <p className="text-gray-300 mb-6">Generate a comprehensive MVP feature list for your startup idea.</p>
                      <button
                        onClick={() => generateMVPFeatures(selectedIdea)}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isGenerating ? 'Generating...' : 'Generate MVP Features'}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'architecture' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {mvpFeatures ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="text-2xl font-bold text-white mb-6">Technical Architecture</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Technology Stack</h4>
                          <div className="space-y-3">
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                              <h5 className="font-semibold text-white mb-1">Frontend</h5>
                              <p className="text-sm text-gray-300">{mvpFeatures.technicalArchitecture?.frontend}</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                              <h5 className="font-semibold text-white mb-1">Backend</h5>
                              <p className="text-sm text-gray-300">{mvpFeatures.technicalArchitecture?.backend}</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                              <h5 className="font-semibold text-white mb-1">Database</h5>
                              <p className="text-sm text-gray-300">{mvpFeatures.technicalArchitecture?.database}</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                              <h5 className="font-semibold text-white mb-1">Infrastructure</h5>
                              <p className="text-sm text-gray-300">{mvpFeatures.technicalArchitecture?.infrastructure}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Development Timeline</h4>
                          <div className="space-y-3">
                            {mvpFeatures.developmentTimeline && Object.entries(mvpFeatures.developmentTimeline).map(([phase, details]) => (
                              <div key={phase} className="bg-white/5 border border-white/10 rounded-lg p-3">
                                <h5 className="font-semibold text-white mb-1">{phase.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h5>
                                <p className="text-sm text-gray-300 mb-2">Duration: {details.duration}</p>
                                <div className="text-xs text-gray-400">
                                  Features: {details.features?.join(', ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                      <div className="text-6xl mb-4">🏗️</div>
                      <h3 className="text-2xl font-bold text-white mb-2">No Architecture Yet</h3>
                      <p className="text-gray-300 mb-6">Generate MVP features first to see the technical architecture.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'code' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-white">Code Generator</h3>
                      <div className="flex items-center space-x-4">
                        <select
                          value={techStack}
                          onChange={(e) => setTechStack(e.target.value)}
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                        >
                          <option value="React/Node.js">React/Node.js</option>
                          <option value="Vue.js/Express">Vue.js/Express</option>
                          <option value="Angular/NestJS">Angular/NestJS</option>
                          <option value="Next.js/Prisma">Next.js/Prisma</option>
                          <option value="Flutter/Firebase">Flutter/Firebase</option>
                        </select>
                        <button
                          onClick={() => generateCode(selectedIdea, mvpFeatures)}
                          disabled={isGenerating || !mvpFeatures}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {isGenerating ? 'Generating...' : 'Generate Code'}
                        </button>
                      </div>
                    </div>
                    
                    {generatedCode ? (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Project Structure</h4>
                          <div className="bg-slate-800 rounded-lg p-4 text-sm text-gray-300 font-mono">
                            <pre>{JSON.stringify(generatedCode.projectStructure, null, 2)}</pre>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Sample Code Files</h4>
                          <div className="space-y-4">
                            {Object.entries(generatedCode.codeFiles || {}).slice(0, 3).map(([filename, content]) => (
                              <div key={filename} className="bg-slate-800 rounded-lg p-4">
                                <h5 className="text-white font-semibold mb-2">{filename}</h5>
                                <pre className="text-sm text-gray-300 overflow-x-auto">
                                  {content.substring(0, 500)}...
                                </pre>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Deployment Guide</h4>
                          <div className="bg-slate-800 rounded-lg p-4 text-sm text-gray-300">
                            <pre>{generatedCode.deployment?.deploymentGuide || 'Deployment instructions will be generated...'}</pre>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">💻</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Code Generated Yet</h3>
                        <p className="text-gray-300 mb-6">
                          Generate production-ready code for your startup idea. 
                          {!mvpFeatures && ' First generate MVP features to get better code.'}
                        </p>
                        <button
                          onClick={() => generateCode(selectedIdea, mvpFeatures)}
                          disabled={isGenerating}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {isGenerating ? 'Generating...' : 'Generate Code'}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}















