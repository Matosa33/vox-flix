import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import SearchFilters from '../components/SearchFilters';
import VoiceCard from '../components/VoiceCard';
import VoiceDetailModal from '../components/VoiceDetailModal';
import { VoiceModel, SearchFilters as SearchFiltersType, SortOption } from '../types';

const Browse: React.FC = () => {
  const { voiceData, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [selectedVoice, setSelectedVoice] = useState<VoiceModel | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Filter and sort voices
  const filteredVoices = useMemo(() => {
    if (!voiceData) return [];

    let voices = voiceData.models.filter((voice) => {
      // Text search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          voice.name.toLowerCase().includes(query) ||
          voice.description.toLowerCase().includes(query) ||
          voice.tags.some(tag => tag.toLowerCase().includes(query)) ||
          voice.characteristics.tone.toLowerCase().includes(query) ||
          voice.characteristics.accent.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Provider filter
      if (filters.provider && voice.provider !== filters.provider) {
        return false;
      }

      // Language filter
      if (filters.language && !voice.supported_languages.includes(filters.language)) {
        return false;
      }

      // Category filter
      if (filters.category && !voice.categories.includes(filters.category)) {
        return false;
      }

      // Premium filter
      if (filters.premium !== undefined && voice.premium !== filters.premium) {
        return false;
      }

      return true;
    });

    // Sort voices
    voices.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          // For demo purposes, we'll sort by name as a proxy for newest
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return voices;
  }, [voiceData, searchQuery, filters, sortBy]);

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
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
          sortBy={sortBy}
          onSortChange={setSortBy}
          resultsCount={filteredVoices.length}
        />

        <div className="container mx-auto px-4 py-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {searchQuery || Object.keys(filters).length > 0 
                ? `Search Results (${filteredVoices.length} ${t('search.results_found')})` 
                : `All Voices (${filteredVoices.length} ${t('search.results_found')})`
              }
            </h2>
            {filteredVoices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVoices.map((voice) => (
                  <VoiceCard
                    key={voice.id}
                    voice={voice}
                    onPlay={handlePlayVoice}
                    onLearnMore={handleLearnMore}
                    isPlaying={playingVoiceId === voice.id}
                    size="medium"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No voices found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({});
                  }}
                  className="mt-4 text-red-400 hover:text-red-300"
                >
                  Clear search and browse all voices
                </button>
              </div>
            )}
          </div>
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

export default Browse;
