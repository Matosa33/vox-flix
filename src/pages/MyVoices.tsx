import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Download, Trash2, Play, Mic, HardDrive, Cloud } from 'lucide-react';

interface DownloadedModel {
  id: string;
  name: string;
  size: number;
  provider: string;
  status: string;
}

interface ClonedVoice {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  trainingProgress?: number;
}

const MyVoices: React.FC = () => {
  const { t } = useApp();
  const [downloadedModels, setDownloadedModels] = useState<DownloadedModel[]>([]);
  const [clonedVoices, setClonedVoices] = useState<ClonedVoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyVoices();
  }, []);

  const loadMyVoices = async () => {
    try {
      setLoading(true);
      
      // Simulate loading downloaded models
      const mockDownloaded: DownloadedModel[] = [
        {
          id: 'tortoise-custom1',
          name: 'Morgan Freeman Clone',
          size: 2100000000, // 2.1GB
          provider: 'tortoise',
          status: 'ready'
        },
        {
          id: 'bark-narrator',
          name: 'Bark Narrator',
          size: 1800000000, // 1.8GB
          provider: 'bark',
          status: 'ready'
        }
      ];

      // Simulate loading cloned voices
      const mockCloned: ClonedVoice[] = [
        {
          id: 'cloned_1',
          name: 'My Voice',
          status: 'completed',
          createdAt: '2025-01-15T10:30:00Z'
        },
        {
          id: 'cloned_2',
          name: 'Professional Voice',
          status: 'training',
          createdAt: '2025-01-16T14:20:00Z',
          trainingProgress: 75
        }
      ];

      setDownloadedModels(mockDownloaded);
      setClonedVoices(mockCloned);
    } catch (error) {
      console.error('Error loading voices:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const deleteModel = async (modelId: string) => {
    if (confirm('Are you sure you want to delete this model?')) {
      setDownloadedModels(prev => prev.filter(model => model.id !== modelId));
    }
  };

  const deleteClonedVoice = async (voiceId: string) => {
    if (confirm('Are you sure you want to delete this cloned voice?')) {
      setClonedVoices(prev => prev.filter(voice => voice.id !== voiceId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center space-x-3">
          <HardDrive className="w-8 h-8 text-red-500" />
          <span>{t('navigation.my_voices')}</span>
        </h1>

        {/* Cloned Voices Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <Mic className="w-6 h-6 text-green-500" />
            <span>My Cloned Voices</span>
            <span className="text-sm font-normal text-gray-400">({clonedVoices.length})</span>
          </h2>

          {clonedVoices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clonedVoices.map((voice) => (
                <div key={voice.id} className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{voice.name}</h3>
                      <p className="text-sm text-gray-400">Created {formatDate(voice.createdAt)}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      voice.status === 'completed' 
                        ? 'bg-green-600/20 text-green-300 border border-green-600/30'
                        : voice.status === 'training'
                        ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-600/30'
                        : 'bg-gray-600/20 text-gray-300 border border-gray-600/30'
                    }`}>
                      {voice.status === 'completed' ? 'Ready' : 
                       voice.status === 'training' ? 'Training' : voice.status}
                    </div>
                  </div>

                  {voice.status === 'training' && voice.trainingProgress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Training Progress</span>
                        <span>{voice.trainingProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${voice.trainingProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {voice.status === 'completed' && (
                      <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1">
                        <Play className="w-4 h-4" />
                        <span>Test</span>
                      </button>
                    )}
                    <button 
                      onClick={() => deleteClonedVoice(voice.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 p-8 rounded-xl text-center">
              <Mic className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No cloned voices yet</p>
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Clone Your First Voice
              </button>
            </div>
          )}
        </section>

        {/* Downloaded Models Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <Download className="w-6 h-6 text-blue-500" />
            <span>Downloaded Models</span>
            <span className="text-sm font-normal text-gray-400">({downloadedModels.length})</span>
          </h2>

          {downloadedModels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {downloadedModels.map((model) => (
                <div key={model.id} className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                      <p className="text-sm text-gray-400 capitalize">{model.provider}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-300 border border-green-600/30">
                      Ready
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <HardDrive className="w-4 h-4" />
                      <span>{formatFileSize(model.size)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
                      <Play className="w-4 h-4" />
                      <span>Use</span>
                    </button>
                    <button 
                      onClick={() => deleteModel(model.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 p-8 rounded-xl text-center">
              <Cloud className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No downloaded models yet</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Browse Models
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyVoices;
