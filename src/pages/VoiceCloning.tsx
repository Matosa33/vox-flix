import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Mic, Zap, Shield, Globe } from 'lucide-react';

const VoiceCloning: React.FC = () => {
  const handleVoiceCloned = (voiceId: string) => {
    console.log('Voice cloned successfully:', voiceId);
    // Could navigate to My Voices page or show success modal
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
              Voice Cloning Studio
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Create your own AI voice model with just a few audio samples. 
              Our advanced technology captures the unique characteristics of any voice.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="text-center pb-4">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <CardTitle className="text-white text-lg">Fast Training</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Clone any voice in minutes with our optimized AI models
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="text-center pb-4">
                  <Mic className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <CardTitle className="text-white text-lg">High Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Studio-quality voice synthesis with natural intonation
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="text-center pb-4">
                  <Globe className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <CardTitle className="text-white text-lg">Multilingual</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Support for 17+ languages with accent preservation
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="text-center pb-4">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <CardTitle className="text-white text-lg">Secure</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Your voice data is processed securely and privately
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Voice Cloning Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Voice Information
                </CardTitle>
                <CardDescription>
                  Provide details about the voice you want to clone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white">Voice Name *</label>
                  <input
                    placeholder="e.g., Morgan Freeman Voice"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white">Description (Optional)</label>
                  <textarea
                    placeholder="Describe the voice characteristics..."
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Audio Samples</CardTitle>
                <CardDescription>
                  Record or upload 3-5 audio samples
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
                  <Mic className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">Click to start recording or drag audio files here</p>
                  <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Start Recording
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Record Samples</h3>
                <p className="text-gray-400">
                  Provide 3-5 clear audio samples of the voice you want to clone. 
                  Each sample should be 10-30 seconds long.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Training</h3>
                <p className="text-gray-400">
                  Our advanced AI analyzes the voice characteristics and creates 
                  a personalized voice model in minutes.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Generate Speech</h3>
                <p className="text-gray-400">
                  Use your cloned voice to convert any text to speech with 
                  the same tone and characteristics.
                </p>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-16 bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Tips for Best Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-400">✓ Do</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Use a quiet environment with minimal background noise</li>
                  <li>• Speak clearly and at a natural pace</li>
                  <li>• Include different emotions and tones</li>
                  <li>• Use high-quality microphone if possible</li>
                  <li>• Vary sentence types (questions, statements, exclamations)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-400">✗ Avoid</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Recording in noisy environments</li>
                  <li>• Speaking too fast or too slow</li>
                  <li>• Using only monotone samples</li>
                  <li>• Low-quality audio with echo or distortion</li>
                  <li>• Samples that are too short (under 10 seconds)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCloning;
