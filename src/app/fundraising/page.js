'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '../../components/AuthGuard';
import { getUserInfo } from '../../utils/auth';
import { motion } from 'framer-motion';

export default function Fundraising() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('pitch-sim');
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [pitchDeck, setPitchDeck] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [emailTemplate, setEmailTemplate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [emailForm, setEmailForm] = useState({
    recipientType: 'investor',
    purpose: 'funding',
    startupInfo: {}
  });
  const router = useRouter();

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
      setEmailForm(prev => ({
        ...prev,
        startupInfo: {
          name: userInfo.startup?.name || '',
          industry: userInfo.startup?.industry || '',
          stage: userInfo.startup?.stage || '',
          description: ''
        }
      }));
    }
  }, []);

  const simulateInvestorPitch = async (deck) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/investors/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pitchDeck: deck,
          userContext: {
            role: user?.role,
            startup: user?.startup,
            profile: user?.profile
          }
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSimulation(data.simulation);
        setActiveTab('feedback');
      } else {
        throw new Error(data.message || 'Failed to simulate investor pitch');
      }
    } catch (error) {
      console.error('Error simulating investor pitch:', error);
      alert('Failed to simulate investor pitch. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateEmailTemplate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/email-templates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientType: emailForm.recipientType,
          startupInfo: emailForm.startupInfo,
          purpose: emailForm.purpose
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setEmailTemplate(data.emailTemplate);
        setActiveTab('email-templates');
      } else {
        throw new Error(data.message || 'Failed to generate email template');
      }
    } catch (error) {
      console.error('Error generating email template:', error);
      alert('Failed to generate email template. Please try again.');
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
              💰 Fundraising & Networking
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Perfect your pitch, find investors, and create compelling outreach campaigns
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
                  onClick={() => setActiveTab('pitch-sim')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'pitch-sim'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🎯 Pitch Simulation
                </button>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'feedback'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  📊 Investor Feedback
                </button>
                <button
                  onClick={() => setActiveTab('email-templates')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'email-templates'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  📧 Email Templates
                </button>
                <button
                  onClick={() => setActiveTab('investor-matching')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'investor-matching'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🔍 Find Investors
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'pitch-sim' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">Investor Pitch Simulation</h3>
                    <button
                      onClick={() => simulateInvestorPitch(pitchDeck || selectedIdea)}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isGenerating ? 'Simulating...' : 'Start Simulation'}
                    </button>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Practice your pitch with AI-powered investor simulation. Get realistic feedback and questions.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">🎯 What You'll Get</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Realistic investor feedback</li>
                        <li>• Common questions and concerns</li>
                        <li>• Investment decision simulation</li>
                        <li>• Improvement suggestions</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">⚡ Simulation Features</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Multiple investor personas</li>
                        <li>• Industry-specific questions</li>
                        <li>• Risk assessment</li>
                        <li>• Valuation estimates</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'feedback' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {simulation ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="text-2xl font-bold text-white mb-6">Investor Feedback</h3>
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-3">Overall Score</h4>
                            <div className="text-4xl font-bold text-purple-400 mb-2">
                              {simulation.feedback?.overallScore}/10
                            </div>
                            <p className="text-gray-300">
                              Recommendation: <span className="font-semibold text-white">
                                {simulation.feedback?.recommendation}
                              </span>
                            </p>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-3">Investment Decision</h4>
                            <div className="text-2xl font-bold text-green-400 mb-2">
                              {simulation.investmentDecision?.decision}
                            </div>
                            <p className="text-gray-300">
                              Amount: <span className="font-semibold text-white">
                                {simulation.investmentDecision?.amount}
                              </span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-3">Strengths</h4>
                            <ul className="space-y-2">
                              {simulation.feedback?.strengths?.map((strength, index) => (
                                <li key={index} className="flex items-center space-x-2">
                                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                  <span className="text-gray-300">{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-3">Areas for Improvement</h4>
                            <ul className="space-y-2">
                              {simulation.feedback?.weaknesses?.map((weakness, index) => (
                                <li key={index} className="flex items-center space-x-2">
                                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                  <span className="text-gray-300">{weakness}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Common Questions</h4>
                          <div className="space-y-3">
                            {simulation.questions?.map((question, index) => (
                              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-semibold text-white">{question.question}</h5>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    question.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                                    question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                    'bg-red-500/20 text-red-300'
                                  }`}>
                                    {question.difficulty}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-400">Category: {question.category}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Suggestions</h4>
                          <ul className="space-y-2">
                            {simulation.suggestions?.map((suggestion, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                <span className="text-gray-300">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                      <div className="text-6xl mb-4">📊</div>
                      <h3 className="text-2xl font-bold text-white mb-2">No Feedback Yet</h3>
                      <p className="text-gray-300 mb-6">Run a pitch simulation to get detailed investor feedback.</p>
                      <button
                        onClick={() => simulateInvestorPitch(pitchDeck || selectedIdea)}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isGenerating ? 'Simulating...' : 'Start Simulation'}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'email-templates' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="text-2xl font-bold text-white mb-6">Cold Email Templates</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Recipient Type</label>
                        <select
                          value={emailForm.recipientType}
                          onChange={(e) => setEmailForm(prev => ({ ...prev, recipientType: e.target.value }))}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                        >
                          <option value="investor">Investor</option>
                          <option value="mentor">Mentor</option>
                          <option value="customer">Customer</option>
                          <option value="partner">Business Partner</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Purpose</label>
                        <select
                          value={emailForm.purpose}
                          onChange={(e) => setEmailForm(prev => ({ ...prev, purpose: e.target.value }))}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                        >
                          <option value="funding">Funding</option>
                          <option value="mentorship">Mentorship</option>
                          <option value="partnership">Partnership</option>
                          <option value="sales">Sales</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-white mb-2">Startup Description</label>
                      <textarea
                        value={emailForm.startupInfo.description}
                        onChange={(e) => setEmailForm(prev => ({ 
                          ...prev, 
                          startupInfo: { ...prev.startupInfo, description: e.target.value }
                        }))}
                        placeholder="Describe your startup, what you do, and what makes you unique..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white h-24"
                      />
                    </div>

                    <button
                      onClick={generateEmailTemplate}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isGenerating ? 'Generating...' : 'Generate Email Template'}
                    </button>
                  </div>

                  {emailTemplate && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h4 className="text-lg font-semibold text-white mb-4">Generated Email Template</h4>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-semibold text-white mb-2">Subject Line</h5>
                          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                            <p className="text-gray-300">{emailTemplate.subject}</p>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-white mb-2">Email Template</h5>
                          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <pre className="text-gray-300 whitespace-pre-wrap">{emailTemplate.template}</pre>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-white mb-2">Personalization Tips</h5>
                          <ul className="space-y-1">
                            {emailTemplate.personalizationTips?.map((tip, index) => (
                              <li key={index} className="text-gray-300 text-sm">• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'investor-matching' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">Find Investors</h3>
                  <p className="text-gray-300 mb-6">
                    Discover investors who match your startup's industry, stage, and funding needs.
                  </p>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        name: "TechCrunch Ventures",
                        type: "VC",
                        stage: "Seed to Series A",
                        industries: ["SaaS", "AI/ML", "Fintech"],
                        location: "San Francisco, CA",
                        investmentRange: "$500K - $5M"
                      },
                      {
                        name: "GreenTech Angels",
                        type: "Angel",
                        stage: "Pre-seed to Seed",
                        industries: ["Sustainability", "CleanTech", "Green Energy"],
                        location: "Austin, TX",
                        investmentRange: "$50K - $500K"
                      },
                      {
                        name: "HealthTech Capital",
                        type: "VC",
                        stage: "Series A to B",
                        industries: ["Healthcare", "MedTech", "Digital Health"],
                        location: "Boston, MA",
                        investmentRange: "$2M - $10M"
                      }
                    ].map((investor, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2">{investor.name}</h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-300"><strong>Type:</strong> {investor.type}</p>
                          <p className="text-gray-300"><strong>Stage:</strong> {investor.stage}</p>
                          <p className="text-gray-300"><strong>Industries:</strong> {investor.industries.join(', ')}</p>
                          <p className="text-gray-300"><strong>Location:</strong> {investor.location}</p>
                          <p className="text-gray-300"><strong>Range:</strong> {investor.investmentRange}</p>
                        </div>
                        <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                          View Profile
                        </button>
                      </div>
                    ))}
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













