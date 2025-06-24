import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import HeroBanner from '../components/HeroBanner';
import VoiceCarousel from '../components/VoiceCarousel';
import VoiceDetailModal from '../components/VoiceDetailModal';
import { VoiceModel } from '../types';

const Home: React.FC = () => {
  const { voiceData, t } = useApp();
  const [selectedVoice, setSelectedVoice] = useState<VoiceModel | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Get voices by category
  const getVoicesByCategory = (category: string) => {
    if (!voiceData) return [];
    return voiceData.models.filter(voice => voice.categories.includes(category));
  };

  // Featured voice (first trending voice)
  const featuredVoice = useMemo(() => {
    return getVoicesByCategory('trending')[0] || voiceData?.models[0];
  }, [voiceData]);

  const handlePlayVoice = (voice: VoiceModel) => {
    if (playingVoiceId === voice.id) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(voice.id);
      // Simulate playing for 3 seconds
      setTimeout(() => setPlayingVoiceId(null), 3000);
    }
  };

  const handleLearnMore = (voice: VoiceModel) => {
    setSelectedVoice(voice);
  };

  if (!voiceData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-lg">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-20">
        {featuredVoice && (
          <HeroBanner
            featuredVoice={featuredVoice}
            onPlaySample={handlePlayVoice}
            onLearnMore={handleLearnMore}
          />
        )}

        <div className="container mx-auto px-4 py-8">
          {/* Trending Voices */}
          <VoiceCarousel
            title={t('categories.trending')}
            voices={getVoicesByCategory('trending')}
            onPlayVoice={handlePlayVoice}
            onLearnMore={handleLearnMore}
            playingVoiceId={playingVoiceId}
          />

          {/* New Additions */}
          <VoiceCarousel
            title={t('categories.new')}
            voices={getVoicesByCategory('new')}
            onPlayVoice={handlePlayVoice}
            onLearnMore={handleLearnMore}
            playingVoiceId={playingVoiceId}
          />

          {/* Best for Narration */}
          <VoiceCarousel
            title={t('categories.narration')}
            voices={getVoicesByCategory('narration')}
            onPlayVoice={handlePlayVoice}
            onLearnMore={handleLearnMore}
            playingVoiceId={playingVoiceId}
          />

          {/* Multilingual Models */}
          <VoiceCarousel
            title={t('categories.multilingual')}
            voices={getVoicesByCategory('multilingual')}
            onPlayVoice={handlePlayVoice}
            onLearnMore={handleLearnMore}
            playingVoiceId={playingVoiceId}
          />

          {/* French Voices */}
          <VoiceCarousel
            title={t('categories.french')}
            voices={getVoicesByCategory('french')}
            onPlayVoice={handlePlayVoice}
            onLearnMore={handleLearnMore}
            playingVoiceId={playingVoiceId}
          />

          {/* Celebrity & Character Voices */}
          <VoiceCarousel
            title={t('categories.celebrity')}
            voices={getVoicesByCategory('celebrity')}
            onPlayVoice={handlePlayVoice}
            onLearnMore={handleLearnMore}
            playingVoiceId={playingVoiceId}
          />
        </div>
      </main>

      {/* Voice Detail Modal */}
      <VoiceDetailModal
        voice={selectedVoice}
        isOpen={!!selectedVoice}
        onClose={() => setSelectedVoice(null)}
        onPlaySample={handlePlayVoice}
        isPlayingSample={playingVoiceId === selectedVoice?.id}
      />
    </div>
  );
};

export default Home;
