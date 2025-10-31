'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '../../components/AuthGuard';
import { getUserInfo } from '../../utils/auth';
import { motion } from 'framer-motion';

export default function BusinessPlanning() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('canvas');
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [businessPlan, setBusinessPlan] = useState(null);
  const [pitchDeck, setPitchDeck] = useState(null);
  const [financialModel, setFinancialModel] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  const generateBusinessPlan = async (idea) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/business-plan/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?._id,
          idea: idea,
          title: `${idea.title} - Business Plan`
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setBusinessPlan(data.businessPlan);
        setActiveTab('plan');
      } else {
        throw new Error(data.message || 'Failed to generate business plan');
      }
    } catch (error) {
      console.error('Error generating business plan:', error);
      alert('Failed to generate business plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePitchDeck = async (idea, plan) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/pitch-deck/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?._id,
          idea: idea,
          businessPlan: plan,
          title: `${idea.title} - Pitch Deck`
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPitchDeck(data.pitchDeck);
        setActiveTab('pitch');
      } else {
        throw new Error(data.message || 'Failed to generate pitch deck');
      }
    } catch (error) {
      console.error('Error generating pitch deck:', error);
      alert('Failed to generate pitch deck. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFinancialModel = async (idea, plan) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/financial-model/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?._id,
          idea: idea,
          businessPlan: plan,
          title: `${idea.title} - Financial Model`
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setFinancialModel(data.financialModel);
        setActiveTab('financial');
      } else {
        throw new Error(data.message || 'Failed to generate financial model');
      }
    } catch (error) {
      console.error('Error generating financial model:', error);
      alert('Failed to generate financial model. Please try again.');
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
              📊 Business Planning Hub
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Create comprehensive business plans, pitch decks, and financial models with AI assistance
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
                  onClick={() => setActiveTab('canvas')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'canvas'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  📋 Lean Canvas
                </button>
                <button
                  onClick={() => setActiveTab('plan')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'plan'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  📊 Business Plan
                </button>
                <button
                  onClick={() => setActiveTab('pitch')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'pitch'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🎯 Pitch Deck
                </button>
                <button
                  onClick={() => setActiveTab('financial')}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'financial'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  💰 Financial Model
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'canvas' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">Lean Canvas Generator</h3>
                    <button
                      onClick={() => generateBusinessPlan(selectedIdea)}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isGenerating ? 'Generating...' : 'Generate Canvas'}
                    </button>
                  </div>
                  <p className="text-gray-300 mb-6">
                    The Lean Canvas is a 1-page business plan template that helps you deconstruct your idea into its key assumptions.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { title: 'Problem', description: 'Top 3 problems you solve' },
                      { title: 'Solution', description: 'Top 3 features of your solution' },
                      { title: 'Key Metrics', description: 'Key activities you measure' },
                      { title: 'Unique Value Prop', description: 'Single, clear, compelling message' },
                      { title: 'Unfair Advantage', description: 'Something that cannot be easily copied' },
                      { title: 'Channels', description: 'Path to customers' },
                      { title: 'Customer Segments', description: 'Target customers' },
                      { title: 'Cost Structure', description: 'Customer acquisition costs' },
                      { title: 'Revenue Streams', description: 'How you make money' }
                    ].map((item, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'plan' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {businessPlan ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="text-2xl font-bold text-white mb-6">Business Plan</h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Executive Summary</h4>
                          <p className="text-gray-300">{businessPlan.executiveSummary}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-3">Market Analysis</h4>
                            <div className="space-y-2">
                              <p className="text-gray-300"><strong>Market Size:</strong> {businessPlan.marketAnalysis?.marketSize}</p>
                              <p className="text-gray-300"><strong>Target Market:</strong> {businessPlan.marketAnalysis?.targetMarket}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-3">Financial Projections</h4>
                            <div className="space-y-2">
                              <p className="text-gray-300"><strong>Year 1 Revenue:</strong> ${businessPlan.financialProjections?.year1?.revenue?.toLocaleString()}</p>
                              <p className="text-gray-300"><strong>Year 2 Revenue:</strong> ${businessPlan.financialProjections?.year2?.revenue?.toLocaleString()}</p>
                              <p className="text-gray-300"><strong>Year 3 Revenue:</strong> ${businessPlan.financialProjections?.year3?.revenue?.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                      <div className="text-6xl mb-4">📊</div>
                      <h3 className="text-2xl font-bold text-white mb-2">No Business Plan Yet</h3>
                      <p className="text-gray-300 mb-6">Generate a comprehensive business plan for your startup idea.</p>
                      <button
                        onClick={() => generateBusinessPlan(selectedIdea)}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isGenerating ? 'Generating...' : 'Generate Business Plan'}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'pitch' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {pitchDeck ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="text-2xl font-bold text-white mb-6">Pitch Deck</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {pitchDeck.slides?.map((slide, index) => (
                          <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <h4 className="font-semibold text-white mb-2">Slide {slide.slideNumber}: {slide.title}</h4>
                            <p className="text-sm text-gray-300 mb-3">{slide.content}</p>
                            {slide.notes && (
                              <div className="text-xs text-gray-400 bg-white/5 rounded p-2">
                                <strong>Notes:</strong> {slide.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                      <div className="text-6xl mb-4">🎯</div>
                      <h3 className="text-2xl font-bold text-white mb-2">No Pitch Deck Yet</h3>
                      <p className="text-gray-300 mb-6">Create a compelling pitch deck to present your startup to investors.</p>
                      <button
                        onClick={() => generatePitchDeck(selectedIdea, businessPlan)}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isGenerating ? 'Generating...' : 'Generate Pitch Deck'}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'financial' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {financialModel ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="text-2xl font-bold text-white mb-6">Financial Model</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Revenue Projections</h4>
                          <div className="space-y-2">
                            <p className="text-gray-300"><strong>Year 1:</strong> ${financialModel.revenueProjections?.year1?.toLocaleString()}</p>
                            <p className="text-gray-300"><strong>Year 2:</strong> ${financialModel.revenueProjections?.year2?.toLocaleString()}</p>
                            <p className="text-gray-300"><strong>Year 3:</strong> ${financialModel.revenueProjections?.year3?.toLocaleString()}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Unit Economics</h4>
                          <div className="space-y-2">
                            <p className="text-gray-300"><strong>CAC:</strong> ${financialModel.unitEconomics?.customerAcquisitionCost}</p>
                            <p className="text-gray-300"><strong>LTV:</strong> ${financialModel.unitEconomics?.lifetimeValue}</p>
                            <p className="text-gray-300"><strong>Payback Period:</strong> {financialModel.unitEconomics?.paybackPeriod} months</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                      <div className="text-6xl mb-4">💰</div>
                      <h3 className="text-2xl font-bold text-white mb-2">No Financial Model Yet</h3>
                      <p className="text-gray-300 mb-6">Create detailed financial projections and unit economics for your startup.</p>
                      <button
                        onClick={() => generateFinancialModel(selectedIdea, businessPlan)}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isGenerating ? 'Generating...' : 'Generate Financial Model'}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}













