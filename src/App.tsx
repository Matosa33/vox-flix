import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApp } from './contexts/AppContext';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Browse from './pages/Browse';
import VoiceCloning from './pages/VoiceCloning';
import MyVoices from './pages/MyVoices';

const App: React.FC = () => {
  const { loading, error, t } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-lg">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-lg text-red-500 mb-4">{error || t('common.error')}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('common.try_again')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/voice-cloning" element={<VoiceCloning />} />
        <Route path="/my-voices" element={<MyVoices />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <div className="flex flex-wrap justify-center space-x-6 mb-4">
            <a href="#" className="hover:text-white transition-colors">{t('footer.about')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.contact')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
          </div>
          <p className="text-sm">
            &copy; 2025 {t('app.title')}. {t('app.tagline')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
