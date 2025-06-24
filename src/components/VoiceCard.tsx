import React, { useState } from 'react';
import { Play, Pause, Star, Download, Eye } from 'lucide-react';
import { VoiceModel } from '../types';
import { useApp } from '../contexts/AppContext';

interface VoiceCardProps {
  voice: VoiceModel;
  onPlay: (voice: VoiceModel) => void;
  onLearnMore: (voice: VoiceModel) => void;
  isPlaying?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const VoiceCard: React.FC<VoiceCardProps> = ({ 
  voice, 
  onPlay, 
  onLearnMore, 
  isPlaying = false,
  size = 'medium'
}) => {
  const { t, voiceData } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  const providerName = voiceData?.providers[voice.provider] || voice.provider;

  const sizeClasses = {
    small: 'w-48',
    medium: 'w-64',
    large: 'w-80'
  };

  const getVoiceImage = (voiceId: string) => {
    // Map voice IDs to their image files
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
    <div 
      className={`${sizeClasses[size]} bg-gray-900 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:z-10 relative group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={getVoiceImage(voice.id)}
          alt={voice.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            // Fallback to a gradient background if image fails to load
            (e.target as HTMLImageElement).style.display = 'none';
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) {
              parent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Provider badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {providerName}
          </span>
        </div>

        {/* Premium badge */}
        {voice.premium ? (
          <div className="absolute top-3 right-3">
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs px-2 py-1 rounded-full font-bold">
              {t('voice_card.premium')}
            </span>
          </div>
        ) : (
          <div className="absolute top-3 right-3">
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
              <Download className="w-3 h-3" />
              <span>{t('voice_card.free')}</span>
            </span>
          </div>
        )}

        {/* Play overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(voice);
              }}
              className="bg-white/90 text-black p-4 rounded-full transition-all duration-200 hover:bg-white hover:scale-110"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-1" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-bold text-lg truncate">{voice.name}</h3>
          <div className="flex items-center space-x-1 ml-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm">{voice.rating}</span>
          </div>
        </div>

        {/* Language and characteristics */}
        <div className="text-gray-400 text-sm mb-3">
          <span className="capitalize">{voice.characteristics.gender}</span>
          <span className="mx-1">•</span>
          <span className="capitalize">{voice.characteristics.accent}</span>
          <span className="mx-1">•</span>
          <span>{voice.language}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {voice.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(voice);
            }}
            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
          >
            <Play className="w-4 h-4" />
            <span>{t('voice_card.play_sample')}</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLearnMore(voice);
            }}
            className="bg-gray-700 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-600 transition-colors flex items-center justify-center"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Download info for open source models */}
        {!voice.premium && voice.downloadSize && (
          <div className="mt-3 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>{t('voice_detail.download_size')}</span>
              <span>{voice.downloadSize}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceCard;
