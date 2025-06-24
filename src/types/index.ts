export interface VoiceModel {
  id: string;
  name: string;
  provider: string;
  language: string;
  categories: string[];
  tags: string[];
  description: string;
  characteristics: {
    gender: string;
    age: string;
    accent: string;
    tone: string;
  };
  samples: string[];
  supported_languages: string[];
  premium: boolean;
  rating: number;
  downloadSize?: string;
  requirements?: string;
}

export interface VoiceData {
  categories: Record<string, string>;
  providers: Record<string, string>;
  models: VoiceModel[];
}

export interface Translation {
  [key: string]: any;
}

export interface Translations {
  [language: string]: Translation;
}

export type Language = 'en' | 'fr';

export interface SearchFilters {
  provider?: string;
  language?: string;
  category?: string;
  premium?: boolean;
}

export type SortOption = 'name' | 'rating' | 'newest';
