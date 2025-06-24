import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { SearchFilters as SearchFiltersType, SortOption } from '../types';
import { useApp } from '../contexts/AppContext';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultsCount: number;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  resultsCount
}) => {
  const { t, voiceData } = useApp();

  const providers = voiceData?.providers || {};
  const categories = voiceData?.categories || {};

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'fr-FR', name: 'French' },
    { code: 'fr-CA', name: 'French (Canada)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'es-MX', name: 'Spanish (Mexico)' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' }
  ];

  const clearFilters = () => {
    onFiltersChange({});
    onSearchChange('');
  };

  const hasActiveFilters = searchQuery || Object.keys(filters).some(key => filters[key as keyof SearchFiltersType]);

  return (
    <div className="bg-gray-900 border-b border-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('navigation.search')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700 focus:border-red-500 focus:outline-none text-lg"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filters and sort */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Filter by provider */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm font-medium">{t('search.filter_by')}:</span>
            </div>

            <select
              value={filters.provider || ''}
              onChange={(e) => onFiltersChange({ ...filters, provider: e.target.value || undefined })}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none text-sm"
            >
              <option value="">{t('search.all_providers')}</option>
              {Object.entries(providers).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>

            {/* Filter by language */}
            <select
              value={filters.language || ''}
              onChange={(e) => onFiltersChange({ ...filters, language: e.target.value || undefined })}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none text-sm"
            >
              <option value="">{t('search.all_languages')}</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>

            {/* Filter by category */}
            <select
              value={filters.category || ''}
              onChange={(e) => onFiltersChange({ ...filters, category: e.target.value || undefined })}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none text-sm"
            >
              <option value="">All Categories</option>
              {Object.entries(categories).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>

            {/* Filter by premium */}
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.premium === true}
                  onChange={(e) => onFiltersChange({ 
                    ...filters, 
                    premium: e.target.checked ? true : undefined 
                  })}
                  className="rounded bg-gray-800 border-gray-700 text-red-600 focus:ring-red-500 focus:ring-offset-gray-900"
                />
                <span className="text-gray-300 text-sm">Premium Only</span>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.premium === false}
                  onChange={(e) => onFiltersChange({ 
                    ...filters, 
                    premium: e.target.checked ? false : undefined 
                  })}
                  className="rounded bg-gray-800 border-gray-700 text-green-600 focus:ring-green-500 focus:ring-offset-gray-900"
                />
                <span className="text-gray-300 text-sm">Free Only</span>
              </label>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Clear filters</span>
              </button>
            )}
          </div>

          {/* Sort and results count */}
          <div className="flex items-center space-x-4">
            <div className="text-gray-400 text-sm">
              {resultsCount} {t('search.results_found')}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">{t('search.sort_by')}:</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none text-sm"
              >
                <option value="name">{t('search.name')}</option>
                <option value="rating">{t('search.rating')}</option>
                <option value="newest">{t('search.newest')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
