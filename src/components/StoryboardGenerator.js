import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaEye, FaCog } from 'react-icons/fa';

const StoryboardGenerator = ({ storyboard }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const nextScene = () => {
    if (currentScene < storyboard.scenes.length - 1) {
      setCurrentScene(currentScene + 1);
    }
  };

  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Auto-advance scenes
      const interval = setInterval(() => {
        setCurrentScene(prev => {
          if (prev >= storyboard.scenes.length - 1) {
            setIsPlaying(false);
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 10000); // 10 seconds per scene
    }
  };

  const renderCharacter = (character, index) => {
    const shapes = {
      circle: 'rounded-full',
      square: 'rounded-lg',
      star: 'clip-path-star'
    };

    return (
      <motion.div
        key={character.name}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: index * 0.2, duration: 0.5 }}
        className={`w-20 h-20 ${shapes[character.shape]} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
        style={{ backgroundColor: character.color }}
      >
        {character.name[0]}
      </motion.div>
    );
  };

  const renderBackground = (background) => {
    const backgroundStyles = {
      'sunny meadow with colorful flowers': 'bg-gradient-to-b from-blue-300 to-green-300',
      'magical forest with glowing trees': 'bg-gradient-to-b from-purple-400 to-green-500',
      'starry night sky with moon': 'bg-gradient-to-b from-indigo-900 to-blue-800',
      'underwater world with bubbles': 'bg-gradient-to-b from-blue-400 to-teal-600',
      'cloudy sky with rainbow': 'bg-gradient-to-b from-blue-200 to-pink-200',
      'cozy village with houses': 'bg-gradient-to-b from-orange-200 to-yellow-200'
    };

    return (
      <div className={`absolute inset-0 ${backgroundStyles[background] || 'bg-gradient-to-b from-blue-300 to-green-300'}`}>
        {/* Add decorative elements */}
        {background.includes('flowers') && (
          <>
            <div className="absolute bottom-0 left-10 w-8 h-8 bg-pink-400 rounded-full"></div>
            <div className="absolute bottom-0 left-20 w-6 h-6 bg-yellow-400 rounded-full"></div>
            <div className="absolute bottom-0 right-10 w-10 h-10 bg-purple-400 rounded-full"></div>
          </>
        )}
        {background.includes('stars') && (
          <>
            <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-5 right-40 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </>
        )}
        {background.includes('moon') && (
          <div className="absolute top-10 right-10 w-16 h-16 bg-yellow-200 rounded-full"></div>
        )}
        {background.includes('rainbow') && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-48 h-24 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 rounded-t-full opacity-70"></div>
        )}
      </div>
    );
  };

  const currentSceneData = storyboard.scenes[currentScene];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{storyboard.title}</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              title="Toggle Details"
            >
              <FaEye className="text-lg" />
            </button>
            <div className="text-sm text-gray-500">
              Scene {currentScene + 1} of {storyboard.scenes.length}
            </div>
          </div>
        </div>

        {/* Scene Preview */}
        <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-6" style={{ height: '400px' }}>
          {renderBackground(currentSceneData.background)}
          
          {/* Characters */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-8">
            {currentSceneData.characters.map((character, index) => renderCharacter(character, index))}
          </div>

          {/* Scene Text Overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-lg p-4 max-w-md">
            <p className="text-gray-800 text-center font-medium">{currentSceneData.text}</p>
          </div>

          {/* Effects Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {currentSceneData.effects.includes('sparkles') && (
              <>
                <div className="absolute top-20 left-20 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
                <div className="absolute top-40 right-30 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
              </>
            )}
            {currentSceneData.effects.includes('bubbles') && (
              <>
                <div className="absolute bottom-20 left-10 w-6 h-6 bg-white bg-opacity-50 rounded-full animate-bounce"></div>
                <div className="absolute bottom-40 right-20 w-4 h-4 bg-white bg-opacity-50 rounded-full animate-bounce"></div>
              </>
            )}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            onClick={prevScene}
            disabled={currentScene === 0}
            className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaStepBackward className="text-gray-700" />
          </button>
          <button
            onClick={togglePlay}
            className="p-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button
            onClick={nextScene}
            disabled={currentScene === storyboard.scenes.length - 1}
            className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaStepForward className="text-gray-700" />
          </button>
        </div>

        {/* Scene Timeline */}
        <div className="flex space-x-2 mb-6">
          {storyboard.scenes.map((scene, index) => (
            <button
              key={scene.id}
              onClick={() => setCurrentScene(index)}
              className={`flex-1 h-2 rounded-full transition-colors ${
                index === currentScene ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Scene Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t pt-6 space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                    <FaCog className="text-sm" />
                    <span>Scene Details</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{currentSceneData.duration}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Background:</span>
                      <span className="font-medium">{currentSceneData.background}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Actions:</span>
                      <span className="font-medium">{currentSceneData.actions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transition:</span>
                      <span className="font-medium">{currentSceneData.transitions}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                    <FaVolumeUp className="text-sm" />
                    <span>Audio & Effects</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sound Effects:</span>
                      <span className="font-medium">{currentSceneData.soundEffects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visual Effects:</span>
                      <span className="font-medium">{currentSceneData.effects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Characters:</span>
                      <span className="font-medium">
                        {currentSceneData.characters.map(c => c.name).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">Dialogue/Narration:</h4>
                <p className="text-purple-800 italic">"{currentSceneData.text}"</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Character Gallery */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Characters</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {storyboard.characters.map((character, index) => (
            <div key={character.name} className="text-center space-y-2">
              <div
                className={`w-16 h-16 mx-auto ${
                  character.shape === 'circle' ? 'rounded-full' : 'rounded-lg'
                } flex items-center justify-center text-white font-bold shadow-lg`}
                style={{ backgroundColor: character.color }}
              >
                {character.name[0]}
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-800">{character.name}</div>
                <div className="text-gray-500 text-xs">{character.personality}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryboardGenerator;
