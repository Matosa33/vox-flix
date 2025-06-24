import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Mic, BookOpen, Wand2, FileText, Volume2, Globe, Zap } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-20">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
              VoxFlix AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform any text into natural, expressive speech with our advanced AI voice models.
              From single sentences to entire books - we've got you covered.
            </p>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <CardTitle className="text-white">Any Length Text</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    From single sentences to 40-page documents, our system handles it all with intelligent chunking
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="text-center">
                  <Mic className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <CardTitle className="text-white">Voice Cloning</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Clone any voice with just a few audio samples using state-of-the-art AI technology
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="text-center">
                  <Globe className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <CardTitle className="text-white">17 Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Support for multiple languages with native-quality pronunciation and intonation
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main TTS Editor */}
          <div className="mb-16 p-8 bg-gray-900 rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Text-to-Speech Generator</h2>
            <p className="text-gray-400 text-center mb-8">Enter text below and convert it to speech with AI voices</p>
            <div className="max-w-4xl mx-auto">
              <textarea
                placeholder="Enter your text here... (up to 50,000 characters)"
                className="w-full h-64 p-4 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
              />
              <div className="mt-4 flex justify-center">
                <button className="px-8 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Generate Speech
                </button>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6">
              <Volume2 className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <h3 className="text-xl font-semibold mb-2">High Quality Audio</h3>
              <p className="text-gray-400">Studio-quality audio output in multiple formats</p>
            </div>
            
            <div className="text-center p-6">
              <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-400">Generate speech in seconds, not minutes</p>
            </div>
            
            <div className="text-center p-6">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
              <h3 className="text-xl font-semibold mb-2">Book-Length Support</h3>
              <p className="text-gray-400">Perfect for audiobooks and long-form content</p>
            </div>
            
            <div className="text-center p-6">
              <Wand2 className="w-12 h-12 mx-auto mb-4 text-pink-400" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-400">Latest AI models for natural-sounding speech</p>
            </div>
          </div>

          {/* Use Cases Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-8">Perfect For</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Content Creators</h3>
                <p className="text-gray-300">
                  Transform your written content into engaging audio for podcasts, YouTube videos, and social media.
                </p>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Authors & Publishers</h3>
                <p className="text-gray-300">
                  Convert books and articles into audiobooks quickly and cost-effectively.
                </p>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Accessibility</h3>
                <p className="text-gray-300">
                  Make your content accessible to visually impaired users and those with reading difficulties.
                </p>
              </div>
            </div>
          </div>
          
          {/* Technology Section */}
          <div className="bg-gray-900 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Powered by Cutting-Edge AI</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              VoxFlix uses multiple AI providers including Coqui TTS (open source), ElevenLabs, and OpenAI 
              to deliver the best possible voice synthesis experience. Choose from hundreds of voices or clone your own.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <span className="px-4 py-2 bg-gray-800 rounded-full text-sm">Coqui TTS</span>
              <span className="px-4 py-2 bg-gray-800 rounded-full text-sm">ElevenLabs</span>
              <span className="px-4 py-2 bg-gray-800 rounded-full text-sm">OpenAI</span>
              <span className="px-4 py-2 bg-gray-800 rounded-full text-sm">XTTS-v2</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
