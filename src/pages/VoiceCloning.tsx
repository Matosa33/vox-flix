import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import AudioRecorder from '../components/AudioRecorder';
import { Mic, Upload, Brain, TestTube } from 'lucide-react';

const VoiceCloning: React.FC = () => {
  const { t } = useApp();
  const [step, setStep] = useState(1);
  const [voiceName, setVoiceName] = useState('');
  const [recordings, setRecordings] = useState<Array<{blob: Blob, duration: number}>>([]);

  const trainingPhrases = [
    "Hello, my name is [Your Name] and I'm creating my voice clone.",
    "The quick brown fox jumps over the lazy dog.",
    "I love to read books and listen to music in my free time.",
    "Technology is advancing rapidly in the modern world.",
    "Please record this sentence clearly and naturally."
  ];

  const handleRecordingComplete = (audioBlob: Blob, duration: number) => {
    setRecordings(prev => [...prev, { blob: audioBlob, duration }]);
  };

  const startTraining = () => {
    // Simulate training start
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center space-x-3">
          <Mic className="w-8 h-8 text-red-500" />
          <span>Clone Your Voice</span>
        </h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= stepNum ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNum ? 'bg-red-600' : 'bg-gray-700'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Setup */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900 p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Upload className="w-6 h-6" />
                <span>Setup Your Voice Clone</span>
              </h2>
              
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Voice Name
                </label>
                <input
                  type="text"
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  placeholder="Enter a name for your voice (e.g., My Voice, John's Voice)"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-300 mb-2">Recording Tips:</h3>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• Record in a quiet environment</li>
                  <li>• Speak clearly and naturally</li>
                  <li>• Record at least 5 different sentences</li>
                  <li>• Each recording should be 10-60 seconds</li>
                </ul>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!voiceName.trim()}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Start Recording
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Recording */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Mic className="w-6 h-6" />
                <span>Record Voice Samples</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Current Phrase:</h3>
                  <div className="bg-gray-800 p-4 rounded-lg mb-6">
                    <p className="text-lg leading-relaxed">
                      {trainingPhrases[recordings.length % trainingPhrases.length]}
                    </p>
                  </div>

                  <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Recordings ({recordings.length}/5)
                  </h3>
                  <div className="space-y-3">
                    {recordings.map((recording, index) => (
                      <div key={index} className="bg-gray-800 p-3 rounded-lg flex items-center justify-between">
                        <span>Recording {index + 1}</span>
                        <span className="text-sm text-gray-400">
                          {Math.round(recording.duration)}s
                        </span>
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, 5 - recordings.length) }).map((_, index) => (
                      <div key={`empty-${index}`} className="bg-gray-700/50 p-3 rounded-lg border-2 border-dashed border-gray-600">
                        <span className="text-gray-500">Recording {recordings.length + index + 1}</span>
                      </div>
                    ))}
                  </div>

                  {recordings.length >= 5 && (
                    <button
                      onClick={startTraining}
                      className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Start Training
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Training */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900 p-8 rounded-xl text-center">
              <h2 className="text-2xl font-bold mb-6 flex items-center justify-center space-x-2">
                <Brain className="w-6 h-6" />
                <span>Training Your Voice</span>
              </h2>

              <div className="mb-8">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Brain className="w-8 h-8" />
                </div>
                <p className="text-lg mb-4">Training in progress...</p>
                <p className="text-gray-400">This usually takes 15-30 minutes</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">What's happening:</h3>
                <ul className="text-left space-y-2 text-gray-300">
                  <li>• Analyzing your voice characteristics</li>
                  <li>• Training neural network model</li>
                  <li>• Optimizing voice synthesis</li>
                  <li>• Preparing for text-to-speech</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceCloning;
