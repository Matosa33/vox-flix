import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { VoiceModel } from '../types';
import VoiceCard from './VoiceCard';

interface VoiceCarouselProps {
  title: string;
  voices: VoiceModel[];
  onPlayVoice: (voice: VoiceModel) => void;
  onLearnMore: (voice: VoiceModel) => void;
  playingVoiceId?: string;
}

const VoiceCarousel: React.FC<VoiceCarouselProps> = ({
  title,
  voices,
  onPlayVoice,
  onLearnMore,
  playingVoiceId
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 'auto',
    containScroll: 'trimSnaps'
  });
  
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: any) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  if (voices.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        
        {/* Navigation buttons */}
        <div className="flex space-x-2">
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className={`p-2 rounded-full transition-all duration-200 ${
              prevBtnDisabled 
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className={`p-2 rounded-full transition-all duration-200 ${
              nextBtnDisabled 
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {voices.map((voice, index) => (
            <div key={voice.id} className="flex-none mr-4 first:ml-0 last:mr-0">
              <VoiceCard
                voice={voice}
                onPlay={onPlayVoice}
                onLearnMore={onLearnMore}
                isPlaying={playingVoiceId === voice.id}
                size="medium"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      {voices.length > 4 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: Math.ceil(voices.length / 4) }).map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-600"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceCarousel;
