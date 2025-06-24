import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Globe, Menu, X, Mic } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Language } from '../../types';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-red-600 tracking-tight hover:text-red-500 transition-colors">
              {t('app.title')}
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/" 
                className={`transition-colors ${
                  isActive('/') 
                    ? 'text-white font-medium' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {t('navigation.home')}
              </Link>
              <Link 
                to="/browse" 
                className={`transition-colors ${
                  isActive('/browse') 
                    ? 'text-white font-medium' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {t('navigation.browse')}
              </Link>
              <Link 
                to="/voice-cloning" 
                className={`transition-colors flex items-center space-x-1 ${
                  isActive('/voice-cloning') 
                    ? 'text-white font-medium' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>Clone Voice</span>
              </Link>
              <Link 
                to="/my-voices" 
                className={`transition-colors ${
                  isActive('/my-voices') 
                    ? 'text-white font-medium' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {t('navigation.my_voices')}
              </Link>
            </nav>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Always visible */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={t('navigation.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-md border border-gray-700 focus:border-red-500 focus:outline-none w-full text-sm"
                />
              </div>
            </form>

            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{language.toUpperCase()}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 bg-gray-800 rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${
                    language === 'en' ? 'text-red-500' : 'text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange('fr')}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${
                    language === 'fr' ? 'text-red-500' : 'text-white'
                  }`}
                >
                  Français
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-3 mt-4">
              <Link 
                to="/" 
                className={`transition-colors ${
                  isActive('/') 
                    ? 'text-white font-medium' 
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.home')}
              </Link>
              <Link 
                to="/browse" 
                className={`transition-colors ${
                  isActive('/browse') 
                    ? 'text-white font-medium' 
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.browse')}
              </Link>
              <Link 
                to="/voice-cloning" 
                className={`transition-colors flex items-center space-x-1 ${
                  isActive('/voice-cloning') 
                    ? 'text-white font-medium' 
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Mic className="w-4 h-4" />
                <span>Clone Voice</span>
              </Link>
              <Link 
                to="/my-voices" 
                className={`transition-colors ${
                  isActive('/my-voices') 
                    ? 'text-white font-medium' 
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.my_voices')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
