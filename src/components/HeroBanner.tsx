import React from 'react';
import { Play, Info, Star, Download } from 'lucide-react';
import { VoiceModel } from '../types';
import { useApp } from '../contexts/AppContext';

interface HeroBannerProps {
  featuredVoice: VoiceModel;
  onPlaySample: (voice: VoiceModel) => void;
  onLearnMore: (voice: VoiceModel) => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ 
  featuredVoice, 
  onPlaySample, 
  onLearnMore 
}) => {
  const { t, voiceData } = useApp();

  const providerName = voiceData?.providers[featuredVoice.provider] || featuredVoice.provider;

  return (
    <div className="relative h-[80vh] bg-gradient-to-r from-black via-gray-900 to-black flex items-center">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
      
      {/* Voice visualization background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-red-600/30 via-purple-600/20 to-blue-600/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 z-10">
        <div className="max-w-2xl">
          {/* Featured badge */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-red-500 font-semibold text-lg">
              {t('hero.featured')}
            </span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>

          {/* Voice name */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            {featuredVoice.name}
          </h1>

          {/* Provider and details */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="bg-gray-800/80 text-white px-3 py-1 rounded-full text-sm font-medium">
              {providerName}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white text-sm font-medium">{featuredVoice.rating}</span>
            </div>
            {featuredVoice.premium ? (
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

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {featuredVoice.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="bg-white/10 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-xl">
            {featuredVoice.description}
          </p>

          {/* Characteristics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(featuredVoice.characteristics).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-gray-400 text-sm capitalize">{key}</div>
                <div className="text-white font-medium capitalize">{value}</div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onPlaySample(featuredVoice)}
              className="flex items-center justify-center space-x-3 bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>{t('hero.watch_now')}</span>
            </button>
            
            <button
              onClick={() => onLearnMore(featuredVoice)}
              className="flex items-center justify-center space-x-3 bg-gray-600/80 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-600 transition-all duration-200 backdrop-blur-sm"
            >
              <Info className="w-6 h-6" />
              <span>{t('hero.more_info')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating voice waveform animation */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
        <div className="flex items-end space-x-1 h-32">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-red-500 to-purple-500 rounded-full opacity-60"
              style={{
                width: '4px',
                height: `${Math.random() * 100 + 20}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
