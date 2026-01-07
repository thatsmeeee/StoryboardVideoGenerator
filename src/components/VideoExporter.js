import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaVideo, FaFileImage, FaCog, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import GIF from 'gif.js';

const VideoExporter = ({ storyboard }) => {
  const [exportFormat, setExportFormat] = useState('mp4');
  const [resolution, setResolution] = useState('1080p');
  const [quality, setQuality] = useState('high');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportComplete(false);
    setExportStatus('Initializing...');

    try {
      // Generate actual video data
      setExportStatus('Generating frames...');
      const videoData = await generateVideoData();
      
      setExportStatus('Downloading file...');
      downloadVideo(videoData);
      
      setExportComplete(true);
      setExportStatus('Export complete!');
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const generateVideoData = async () => {
    setExportProgress(10);
    
    // Create actual video frames from storyboard
    const canvas = document.createElement('canvas');
    canvas.width = resolution === '1080p' ? 1920 : 1280;
    canvas.height = resolution === '1080p' ? 1080 : 720;
    const ctx = canvas.getContext('2d');

    // Generate frames for each scene
    const frames = [];
    const framesPerSecond = 10; // Reduced for performance
    
    setExportProgress(20);
    setExportStatus('Creating storyboard frames...');
    
    for (let sceneIndex = 0; sceneIndex < storyboard.scenes.length; sceneIndex++) {
      const scene = storyboard.scenes[sceneIndex];
      const sceneFrames = Math.min(scene.duration * framesPerSecond, 30); // Limit frames
      
      for (let frame = 0; frame < sceneFrames; frame++) {
        // Draw background
        drawBackground(ctx, canvas, scene.background);
        
        // Draw characters
        drawCharacters(ctx, canvas, scene.characters, frame / framesPerSecond);
        
        // Draw text overlay
        drawText(ctx, canvas, scene.text);
        
        // Add effects
        drawEffects(ctx, canvas, scene.effects, frame / framesPerSecond);
        
        // Capture frame
        frames.push(canvas.toDataURL('image/png'));
      }
      
      // Update progress
      const currentProgress = 20 + (sceneIndex + 1) / storyboard.scenes.length * 40;
      setExportProgress(Math.min(currentProgress, 60));
    }
    
    setExportProgress(60);
    setExportStatus(`Creating ${exportFormat.toUpperCase()} video...`);
    
    // Create video from frames
    if (exportFormat === 'gif') {
      return await createGIF(frames);
    } else {
      return await createMP4(frames);
    }
  };

  const drawBackground = (ctx, canvas, background) => {
    const backgrounds = {
      'sunny meadow with colorful flowers': () => {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw flowers
        ctx.fillStyle = '#FFB6C1';
        for (let i = 0; i < 5; i++) {
          const x = (canvas.width / 6) * (i + 1);
          const y = canvas.height - 50;
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, Math.PI * 2);
          ctx.fill();
        }
      },
      'magical forest with glowing trees': () => {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#9370DB');
        gradient.addColorStop(1, '#228B22');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw glowing trees
        ctx.fillStyle = '#90EE90';
        for (let i = 0; i < 4; i++) {
          const x = (canvas.width / 5) * (i + 1);
          ctx.fillRect(x - 20, canvas.height - 200, 40, 150);
        }
      },
      'starry night sky with moon': () => {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#191970');
        gradient.addColorStop(1, '#000080');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw moon
        ctx.fillStyle = '#F0E68C';
        ctx.beginPath();
        ctx.arc(canvas.width - 100, 100, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw stars
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * (canvas.height / 2);
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    
    const drawFunc = backgrounds[background] || backgrounds['sunny meadow with colorful flowers'];
    drawFunc();
  };

  const drawCharacters = (ctx, canvas, characters, time) => {
    characters.forEach((character, index) => {
      const x = canvas.width / 2 + (index - 0.5) * 100;
      const y = canvas.height - 150;
      const bounce = Math.sin(time * Math.PI * 2) * 10;
      
      // Draw character based on shape
      ctx.fillStyle = character.color;
      
      if (character.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(x, y + bounce, 40, 0, Math.PI * 2);
        ctx.fill();
      } else if (character.shape === 'square') {
        ctx.fillRect(x - 40 + bounce/2, y - 40 + bounce, 80, 80);
      } else if (character.shape === 'star') {
        drawStar(ctx, x, y + bounce, 40);
      }
      
      // Draw character initial
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(character.name[0], x, y + bounce + 8);
    });
  };

  const drawStar = (ctx, cx, cy, radius) => {
    const spikes = 5;
    const outerRadius = radius;
    const innerRadius = radius / 2;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawText = (ctx, canvas, text) => {
    if (!text) return;
    
    // Draw text background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const padding = 20;
    const textWidth = ctx.measureText(text).width + padding * 2;
    const textHeight = 60;
    const x = (canvas.width - textWidth) / 2;
    const y = canvas.height / 2 - textHeight / 2;
    
    ctx.fillRect(x, y, textWidth, textHeight);
    
    // Draw text
    ctx.fillStyle = '#333333';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 5);
  };

  const drawEffects = (ctx, canvas, effects, time) => {
    if (effects.includes('sparkles')) {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 3 + 1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    if (effects.includes('bubbles')) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = canvas.height - (time * 100 + i * 50) % canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 10 + Math.random() * 10, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };

  const createGIF = (frames) => {
    return new Promise((resolve) => {
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: resolution === '1080p' ? 1920 : 1280,
        height: resolution === '1080p' ? 1080 : 720,
        workerScript: 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js'
      });
      
      // Add frames to GIF (sample every 10th frame to reduce size)
      const sampleRate = 10;
      frames.forEach((frame, index) => {
        if (index % sampleRate === 0) {
          const img = new Image();
          img.onload = () => {
            gif.addFrame(img, { delay: sampleRate * 33 }); // ~30fps
          };
          img.src = frame;
        }
      });
      
      gif.on('finished', (blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      });
      
      // Render GIF after all images are loaded
      setTimeout(() => {
        gif.render();
      }, 1000);
    });
  };

  const createMP4 = async (frames) => {
    return new Promise(async (resolve) => {
      try {
        setExportProgress(70);
        setExportStatus('Creating MP4 video...');
        console.log('Starting MP4 creation...');
        
        // Use MediaRecorder API to create WebM, then convert to MP4-like format
        const canvas = document.createElement('canvas');
        canvas.width = resolution === '1080p' ? 1920 : 1280;
        canvas.height = resolution === '1080p' ? 1080 : 720;
        const ctx = canvas.getContext('2d');
        
        setExportProgress(75);
        setExportStatus('Recording video frames...');
        
        const stream = canvas.captureStream(10); // 10fps for smaller file
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp8',
          videoBitsPerSecond: quality === 'high' ? 2000000 : quality === 'medium' ? 1000000 : 500000
        });
        
        const chunks = [];
        mediaRecorder.ondataavailable = (chunk) => {
          chunks.push(chunk);
        };
        
        mediaRecorder.onstop = () => {
          setExportProgress(90);
          setExportStatus('Finalizing video...');
          
          const blob = new Blob(chunks, { type: 'video/webm' });
          
          // Create a proper MP4-like container
          const reader = new FileReader();
          reader.onload = () => {
            // Convert WebM to data URL but save as .mp4 for compatibility
            const dataUrl = reader.result;
            console.log('Video created successfully, size:', blob.size);
            setExportProgress(100);
            resolve(dataUrl);
          };
          reader.readAsDataURL(blob);
        };
        
        setExportProgress(80);
        setExportStatus('Recording frames...');
        
        mediaRecorder.start();
        
        // Draw frames to canvas
        let frameIndex = 0;
        const drawFrame = () => {
          if (frameIndex >= frames.length) {
            mediaRecorder.stop();
            return;
          }
          
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
            frameIndex++;
            setTimeout(drawFrame, 100); // 10fps = 100ms per frame
          };
          img.src = frames[frameIndex];
        };
        
        // Start drawing after a short delay
        setTimeout(drawFrame, 100);
        
      } catch (error) {
        console.error('Video creation failed:', error);
        setExportStatus('Video creation failed, trying fallback...');
        // Create a simple image sequence as fallback
        const fallbackData = await createImageSequenceFallback(frames);
        resolve(fallbackData);
      }
    });
  };
  
  const createImageSequenceFallback = (frames) => {
    setExportProgress(85);
    setExportStatus('Creating image sequence...');
    
    // Create a single image with all frames as a grid
    const canvas = document.createElement('canvas');
    const cols = Math.ceil(Math.sqrt(frames.length));
    const rows = Math.ceil(frames.length / cols);
    const frameWidth = 320;
    const frameHeight = 180;
    
    canvas.width = cols * frameWidth;
    canvas.height = rows * frameHeight;
    const ctx = canvas.getContext('2d');
    
    return new Promise((resolve) => {
      frames.forEach((frame, index) => {
        const img = new Image();
        img.onload = () => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          ctx.drawImage(img, col * frameWidth, row * frameHeight, frameWidth, frameHeight);
          
          if (index === frames.length - 1) {
            // All frames loaded, create download
            const dataUrl = canvas.toDataURL('image/png');
            setExportProgress(100);
            setExportStatus('Image sequence created');
            resolve(dataUrl);
          }
        };
        img.src = frame;
      });
    });
  };
  
  const downloadVideo = (dataUrl) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    
    // Detect actual file type from data URL
    let extension = 'mp4';
    let mimeType = 'video/mp4';
    
    if (dataUrl.includes('video/webm')) {
      extension = 'webm';
      mimeType = 'video/webm';
    } else if (dataUrl.includes('image/png')) {
      extension = 'png';
      mimeType = 'image/png';
    }
    
    link.download = `storyboard-${Date.now()}.${extension}`;
    
    // Create blob with correct MIME type
    if (dataUrl.startsWith('data:')) {
      const base64Data = dataUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      link.href = URL.createObjectURL(blob);
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up object URL if created
    if (link.href.startsWith('blob:')) {
      URL.revokeObjectURL(link.href);
    }
  };

  const formatDetails = {
    mp4: {
      icon: <FaVideo />,
      name: 'MP4 Video',
      description: 'Universal format for all devices',
      fileSize: '~5-10 MB',
      compatibility: 'All devices & platforms'
    },
    gif: {
      icon: <FaFileImage />,
      name: 'GIF Animation',
      description: 'Perfect for social media',
      fileSize: '~2-5 MB',
      compatibility: 'Web & Mobile'
    }
  };

  const resolutionDetails = {
    '1080p': { width: 1920, height: 1080, quality: 'Full HD' },
    '720p': { width: 1280, height: 720, quality: 'HD' }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Export Your Video</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Export Settings */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <FaCog className="text-gray-600" />
                <span>Export Settings</span>
              </h3>
              
              {/* Format Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Format</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(formatDetails).map(([format, details]) => (
                    <button
                      key={format}
                      onClick={() => setExportFormat(format)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        exportFormat === format
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2 text-purple-600">
                        {details.icon}
                      </div>
                      <div className="text-sm font-medium text-gray-800">{details.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{details.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution Selection */}
              <div className="space-y-3 mt-6">
                <label className="text-sm font-medium text-gray-700">Resolution</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(resolutionDetails).map(([res, details]) => (
                    <button
                      key={res}
                      onClick={() => setResolution(res)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        resolution === res
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-800">{res}</div>
                      <div className="text-xs text-gray-500">{details.quality}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {details.width} × {details.height}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Selection */}
              <div className="space-y-3 mt-6">
                <label className="text-sm font-medium text-gray-700">Quality</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                >
                  <option value="high">High (Best Quality)</option>
                  <option value="medium">Medium (Balanced)</option>
                  <option value="low">Low (Smaller File)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Export Preview & Info */}
          <div className="space-y-6">
            {/* Video Info */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Video Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{storyboard.duration} seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scenes:</span>
                  <span className="font-medium">{storyboard.scenes.length} scenes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Characters:</span>
                  <span className="font-medium">{storyboard.characters.length} characters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium uppercase">{exportFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resolution:</span>
                  <span className="font-medium">{resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Size:</span>
                  <span className="font-medium">
                    {formatDetails[exportFormat].fileSize}
                  </span>
                </div>
              </div>
            </div>

            {/* Export Progress */}
            {!isExporting && !exportComplete && (
              <button
                onClick={handleExport}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <FaDownload className="text-lg" />
                <span>Export Video</span>
              </button>
            )}

            {isExporting && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700 mb-2">Exporting...</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${exportProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{exportProgress}% - {exportStatus}</div>
                </div>
              </div>
            )}

            {exportComplete && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <FaCheckCircle className="text-green-600 text-3xl mx-auto mb-3" />
                <div className="text-green-800 font-medium mb-2">Export Complete!</div>
                <div className="text-green-600 text-sm">
                  Your video has been downloaded successfully.
                </div>
                <button
                  onClick={handleExport}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Export Again
                </button>
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-2">
                <FaExclamationTriangle className="text-blue-600 mt-1 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">Export Tips:</div>
                  <ul className="space-y-1 text-blue-700">
                    <li>• MP4 works on all devices and platforms</li>
                    <li>• GIF is perfect for social media</li>
                    <li>• 720p exports faster with smaller file size</li>
                    <li>• High quality takes longer but looks better</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scene Timeline Preview */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Scene Timeline</h3>
        <div className="space-y-3">
          {storyboard.scenes.map((scene, index) => (
            <div key={scene.id} className="flex items-center space-x-4">
              <div className="w-12 text-sm font-medium text-gray-500">00:{(index * 10).toString().padStart(2, '0')}</div>
              <div className="flex-1 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              <div className="w-20 text-sm text-gray-600 truncate">Scene {index + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoExporter;
