import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, User, Award, BookOpen, Sparkles, 
  Edit3, Eye, TrendingUp, Target,
  Briefcase, GraduationCap, Heart
} from 'lucide-react';

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    introduction: '',
    stats: [
      { label: 'Projects Completed', number: '0', icon: 'Briefcase' },
      { label: 'Happy Clients', number: '0', icon: 'Heart' },
      { label: 'Years Experience', number: '0', icon: 'Award' }
    ]
  });

  const icons = {
    Briefcase, Heart, Award, TrendingUp, Target, GraduationCap
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await axios.get('/about');
      const aboutData = response.data;
      setAbout(aboutData);
      setFormData({
        bio: aboutData.bio || '',
        introduction: aboutData.introduction || '',
        stats: aboutData.stats || [
          { label: 'Projects Completed', number: '0', icon: 'Briefcase' },
          { label: 'Happy Clients', number: '0', icon: 'Heart' },
          { label: 'Years Experience', number: '0', icon: 'Award' }
        ]
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching about:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await axios.post('/about', formData);
      
      // Show success animation
      const button = document.getElementById('save-button');
      if (button) {
        button.classList.add('bg-green-600');
        setTimeout(() => {
          button.classList.remove('bg-green-600');
        }, 2000);
      }
      
      alert('About section updated successfully!');
      fetchAbout();
    } catch (error) {
      console.error('Error saving about:', error);
      alert(error.response?.data?.message || 'Error updating about section. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatChange = (index, field, value) => {
    const updatedStats = [...formData.stats];
    updatedStats[index][field] = value;
    setFormData({ ...formData, stats: updatedStats });
  };

  const addStat = () => {
    setFormData({
      ...formData,
      stats: [...formData.stats, { label: 'New Stat', number: '0', icon: 'Target' }]
    });
  };

  const removeStat = (index) => {
    if (formData.stats.length > 1) {
      const updatedStats = formData.stats.filter((_, i) => i !== index);
      setFormData({ ...formData, stats: updatedStats });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
            }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 text-lg"
          >
            Loading about section...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  About Section
                </h1>
                <p className="text-gray-600 text-lg">Craft your personal story and achievements</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => setPreviewMode(!previewMode)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/80 backdrop-blur-xl border border-white/60 text-gray-700 px-4 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all"
              >
                <Eye className="w-5 h-5" />
                <span>{previewMode ? 'Edit Mode' : 'Preview'}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2">
            <AnimatePresence mode="wait">
              {previewMode ? (
                // Preview Mode
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Bio Preview */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Bio</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {formData.bio || 'Your bio will appear here...'}
                    </p>
                  </div>

                  {/* Introduction Preview */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
                    </div>
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {formData.introduction || 'Your introduction will appear here...'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                // Edit Mode
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Bio Section */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">Bio</h2>
                          <p className="text-gray-600">A short description that appears in preview cards</p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          rows="4"
                          className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          placeholder="Write a compelling bio that summarizes who you are and what you do..."
                        />
                        <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                          {formData.bio.length}/200
                        </div>
                      </div>
                    </div>

                    {/* Introduction Section */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
                          <p className="text-gray-600">Your full story, background, and passion</p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <textarea
                          value={formData.introduction}
                          onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                          rows="12"
                          className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          placeholder="Tell your story... Share your journey, passion, and what drives you. This is your chance to connect with your audience on a personal level."
                        />
                        <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                          {formData.introduction.length}/2000
                        </div>
                      </div>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">Achievement Stats</h2>
                            <p className="text-gray-600">Showcase your key metrics and achievements</p>
                          </div>
                        </div>
                        <motion.button
                          type="button"
                          onClick={addStat}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold text-sm"
                        >
                          Add Stat
                        </motion.button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {formData.stats.map((stat, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <select
                                value={stat.icon}
                                onChange={(e) => handleStatChange(index, 'icon', e.target.value)}
                                className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                              >
                                {Object.keys(icons).map(iconName => (
                                  <option key={iconName} value={iconName}>
                                    {iconName}
                                  </option>
                                ))}
                              </select>
                              
                              {formData.stats.length > 1 && (
                                <motion.button
                                  type="button"
                                  onClick={() => removeStat(index)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  ×
                                </motion.button>
                              )}
                            </div>

                            <div className="space-y-2">
                              <input
                                type="text"
                                value={stat.label}
                                onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                                placeholder="Stat label"
                              />
                              <input
                                type="text"
                                value={stat.number}
                                onChange={(e) => handleStatChange(index, 'number', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-bold"
                                placeholder="0"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Save Button */}
                    <motion.button
                      id="save-button"
                      type="submit"
                      disabled={saving}
                      whileHover={{ scale: saving ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <Save className="w-5 h-5" />
                      <span>{saving ? 'Saving Changes...' : 'Save About Section'}</span>
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats Preview Sidebar */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Live Preview */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span>Stats Preview</span>
                </h3>
                
                <div className="space-y-4">
                  {formData.stats.map((stat, index) => {
                    const IconComponent = icons[stat.icon] || Award;
                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>Writing Tips</span>
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                    <span>Keep your bio concise and impactful</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                    <span>Show personality in your introduction</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                    <span>Use stats that highlight your achievements</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                    <span>Be authentic and tell your unique story</span>
                  </li>
                </ul>
              </div>

              {/* Character Counts */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Content Length</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Bio</span>
                      <span>{formData.bio.length}/200</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (formData.bio.length / 200) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Introduction</span>
                      <span>{formData.introduction.length}/2000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (formData.introduction.length / 2000) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;