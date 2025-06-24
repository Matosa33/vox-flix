import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translations, VoiceData } from '../types';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
  voiceData: VoiceData | null;
  loading: boolean;
  error: string | null;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>({});
  const [voiceData, setVoiceData] = useState<VoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get translated text
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  // Load translations and voice data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Import API functions
        const { fetchTranslations, fetchVoiceModels } = await import('../lib/api');
        
        // Load translations
        const translationsData = await fetchTranslations();
        setTranslations(translationsData);
        
        // Load voice data
        const voiceData = await fetchVoiceModels();
        setVoiceData(voiceData);
        
        setError(null);
      } catch (err) {
        setError('Failed to load application data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const value = {
    language,
    setLanguage,
    translations,
    voiceData,
    loading,
    error,
    t
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
