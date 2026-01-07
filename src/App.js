import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDownload, FaStar, FaVideo, FaKeyboard } from 'react-icons/fa';
import StoryboardGenerator from './components/StoryboardGenerator';
import VideoExporter from './components/VideoExporter';
import './App.css';

function App() {
  const [narration, setNarration] = useState('');
  const [storyboard, setStoryboard] = useState(null);
  const [currentView, setCurrentView] = useState('input');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateStoryboard = async () => {
    if (!narration.trim()) return;
    
    setIsGenerating(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedStoryboard = generateStoryboardFromText(narration);
    setStoryboard(generatedStoryboard);
    setCurrentView('storyboard');
    setIsGenerating(false);
  };

  const generateStoryboardFromText = (text) => {
    // Split text into scenes (roughly 10 seconds each for 1-minute video)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const scenesPerVideo = 6; // 6 scenes for 1-minute video
    const sentencesPerScene = Math.ceil(sentences.length / scenesPerVideo);
    
    const scenes = [];
    const characters = [
      { name: 'Luna', color: '#FF6B9D', shape: 'circle', personality: 'curious' },
      { name: 'Ziggy', color: '#4ECDC4', shape: 'square', personality: 'energetic' },
      { name: 'Spark', color: '#FFE66D', shape: 'star', personality: 'wise' }
    ];

    for (let i = 0; i < scenesPerVideo; i++) {
      const startIdx = i * sentencesPerScene;
      const endIdx = Math.min(startIdx + sentencesPerScene, sentences.length);
      const sceneText = sentences.slice(startIdx, endIdx).join('. ').trim();
      
      scenes.push({
        id: i + 1,
        duration: 10,
        text: sceneText,
        background: generateBackground(i),
        characters: [characters[i % characters.length], characters[(i + 1) % characters.length]],
        actions: generateActions(i),
        transitions: generateTransition(i),
        effects: generateEffects(i),
        soundEffects: generateSoundEffects(i)
      });
    }

    return {
      title: 'Generated Storyboard',
      duration: 60,
      resolution: '1080p',
      format: 'MP4',
      scenes,
      characters
    };
  };

  const generateBackground = (sceneIndex) => {
    const backgrounds = [
      'sunny meadow with colorful flowers',
      'magical forest with glowing trees',
      'starry night sky with moon',
      'underwater world with bubbles',
      'cloudy sky with rainbow',
      'cozy village with houses'
    ];
    return backgrounds[sceneIndex % backgrounds.length];
  };

  const generateActions = (sceneIndex) => {
    const actions = [
      'jumping and spinning',
      'waving hands happily',
      'pointing at interesting things',
      'dancing in circles',
      'flying gently',
      'hugging and celebrating'
    ];
    return actions[sceneIndex % actions.length];
  };

  const generateTransition = (sceneIndex) => {
    const transitions = [
      'fade to black',
      'slide from right',
      'zoom in transition',
      'sparkle effect',
      'bounce transition',
      'circle wipe'
    ];
    return transitions[sceneIndex % transitions.length];
  };

  const generateEffects = (sceneIndex) => {
    const effects = [
      'floating particles',
      'sparkles and glows',
      'gentle wind effects',
      'bubble animations',
      'star twinkles',
      'confetti celebration'
    ];
    return effects[sceneIndex % effects.length];
  };

  const generateSoundEffects = (sceneIndex) => {
    const sounds = [
      'happy chimes',
      'whoosh sounds',
      'magical sparkles',
      'bubble pops',
      'gentle bells',
      'celebration fanfare'
    ];
    return sounds[sceneIndex % sounds.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="bg-white shadow-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaVideo className="text-3xl text-purple-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Storyboard Video Generator
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaStar className="text-yellow-500" />
              <span>Develop by Joel</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Create Your Animated Storyboard
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Paste your dialogue, narration, or story text below and watch it transform into a complete 1-minute animated storyboard with characters, scenes, and transitions.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-purple-700 font-medium">
                    <FaKeyboard className="text-lg" />
                    <label htmlFor="narration">Your Story Text</label>
                  </div>
                  <textarea
                    id="narration"
                    value={narration}
                    onChange={(e) => setNarration(e.target.value)}
                    placeholder="Paste your dialogue, narration, or story here... 
                    
Example: Once upon a time, in a magical forest, there lived a curious little fox named Luna. She loved exploring and meeting new friends. One sunny morning, she decided to go on an adventure to find the legendary rainbow flower..."
                    className="w-full h-64 p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-gray-700 placeholder-gray-400"
                  />
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{narration.length} characters</span>
                    <span>Minimum 50 characters recommended</span>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={handleGenerateStoryboard}
                    disabled={!narration.trim() || narration.length < 50 || isGenerating}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center space-x-3"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Generating Storyboard...</span>
                      </>
                    ) : (
                      <>
                        <FaStar className="text-lg" />
                        <span>Generate Storyboard</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <FaKeyboard className="text-purple-600 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Colorful Characters</h3>
                  <p className="text-sm text-gray-600">Automatically generated expressive characters perfect for kids and adults</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                    <FaVideo className="text-pink-600 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-800">6 Dynamic Scenes</h3>
                  <p className="text-sm text-gray-600">Each scene 10 seconds with smooth transitions and animations</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <FaDownload className="text-yellow-600 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Export as Video</h3>
                  <p className="text-sm text-gray-600">Download your storyboard as MP4 or GIF format</p>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'storyboard' && storyboard && (
            <motion.div
              key="storyboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6 flex justify-between items-center">
                <button
                  onClick={() => setCurrentView('input')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back to Input
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setCurrentView('export')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <FaDownload className="text-sm" />
                    <span>Export Video</span>
                  </button>
                </div>
              </div>
              <StoryboardGenerator storyboard={storyboard} />
            </motion.div>
          )}

          {currentView === 'export' && storyboard && (
            <motion.div
              key="export"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6">
                <button
                  onClick={() => setCurrentView('storyboard')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back to Storyboard
                </button>
              </div>
              <VideoExporter storyboard={storyboard} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
