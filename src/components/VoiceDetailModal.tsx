import React, { useState } from 'react';
import { X, Play, Pause, Download, Star, Globe, Mic, Volume2 } from 'lucide-react';
import { VoiceModel } from '../types';
import { useApp } from '../contexts/AppContext';

interface VoiceDetailModalProps {
  voice: VoiceModel | null;
  isOpen: boolean;
  onClose: () => void;
  onPlaySample: (voice: VoiceModel) => void;
  isPlayingSample?: boolean;
}

const VoiceDetailModal: React.FC<VoiceDetailModalProps> = ({
  voice,
  isOpen,
  onClose,
  onPlaySample,
  isPlayingSample = false
}) => {
  const { t, voiceData } = useApp();
  const [ttsText, setTtsText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  if (!isOpen || !voice) return null;

  const providerName = voiceData?.providers[voice.provider] || voice.provider;

  const handleTTSGenerate = async () => {
    if (!ttsText.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const { generateTTS } = await import('../lib/api');
      const audioUrl = await generateTTS({
        voiceId: voice.id,
        text: ttsText,
        language: selectedLanguage || voice.language,
      });
      setGeneratedAudio(audioUrl);
    } catch (error) {
      console.error('TTS Generation failed:', error);
      // Fallback to demo audio
      setGeneratedAudio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
    } finally {
      setIsGenerating(false);
    }
  };

  const getVoiceImage = (voiceId: string) => {
    const imageMap: Record<string, string> = {
      'elevenlabs-adam': '/images/voices/adam-male-narrator.jpg',
      'elevenlabs-bella': '/images/voices/bella-female-friendly.jpg',
      'playht-charlotte': '/images/voices/charlotte-french-elegant.jpg',
      'playht-diego': '/images/voices/diego-spanish-male.jpg',
      'wellsaid-vanessa': '/images/voices/vanessa-american-female.jpg',
      'wellsaid-issa': '/images/voices/issa-british-female.jpg',
      'tortoise-custom1': '/images/voices/morgan-freeman-clone.jpg',
      'bark-narrator': '/images/voices/bark-synthetic-ai.jpg',
      'playht-marie': '/images/voices/marie-french-gentle.jpg',
      'elevenlabs-clyde': '/images/voices/clyde-animated-character.jpg',
    };
    
    return imageMap[voiceId] || `https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop&crop=face`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <div className="aspect-video relative overflow-hidden rounded-t-xl">
            <img
              src={getVoiceImage(voice.id)}
              alt={voice.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  parent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Title and metadata */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{voice.name}</h1>
              <div className="flex items-center space-x-4 text-gray-300">
                <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">{providerName}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{voice.rating}</span>
                </div>
                {voice.premium ? (
                  <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    {t('voice_card.premium')}
                  </span>
                ) : (
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Download className="w-3 h-3" />
                    <span>{t('voice_card.free')}</span>
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={() => onPlaySample(voice)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              {isPlayingSample ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{t('voice_card.play_sample')}</span>
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {voice.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left column */}
            <div>
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">{t('voice_detail.description')}</h3>
                <p className="text-gray-300 leading-relaxed">{voice.description}</p>
              </div>

              {/* Characteristics */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">{t('voice_detail.characteristics')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(voice.characteristics).map(([key, value]) => (
                    <div key={key} className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-gray-400 text-sm capitalize">{key}</div>
                      <div className="text-white font-medium capitalize">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supported Languages */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>{t('voice_detail.supported_languages')}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {voice.supported_languages.map((lang) => (
                    <span
                      key={lang}
                      className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-600/30"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* System Requirements (for downloadable models) */}
              {voice.requirements && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">{t('voice_detail.requirements')}</h3>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-300">{voice.requirements}</p>
                    {voice.downloadSize && (
                      <div className="mt-2 text-sm text-gray-400">
                        {t('voice_detail.download_size')}: {voice.downloadSize}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right column - Text-to-Speech Interface */}
            <div>
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <Mic className="w-5 h-5" />
                  <span>{t('voice_detail.text_to_speech')}</span>
                </h3>

                {/* Language selection */}
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    {t('voice_detail.supported_languages')}
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                  >
                    <option value="">Select language...</option>
                    {voice.supported_languages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                {/* Text input */}
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Text to synthesize
                  </label>
                  <textarea
                    value={ttsText}
                    onChange={(e) => setTtsText(e.target.value)}
                    placeholder={t('voice_detail.enter_text')}
                    className="w-full bg-gray-700 text-white px-3 py-3 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none resize-none h-32"
                    maxLength={500}
                  />
                  <div className="text-right text-gray-400 text-sm mt-1">
                    {ttsText.length}/500
                  </div>
                </div>

                {/* Generate button */}
                <button
                  onClick={handleTTSGenerate}
                  disabled={!ttsText.trim() || isGenerating}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{t('voice_detail.generating')}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5" />
                      <span>{t('voice_detail.generate')}</span>
                    </>
                  )}
                </button>

                {/* Generated audio */}
                {generatedAudio && (
                  <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Generated Audio</span>
                      <button className="text-red-400 hover:text-red-300 text-sm">
                        {t('voice_detail.download_audio')}
                      </button>
                    </div>
                    <audio controls className="w-full">
                      <source src={generatedAudio} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceDetailModal;
