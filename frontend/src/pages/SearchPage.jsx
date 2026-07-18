import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, MessageCircle, Clock, X, Building2, TrendingUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../services/api';
import useAppStore from '../stores/useAppStore';
import Avatar from '../components/ui/Avatar';
import SEO from '../components/seo/SEO';

const TABS = [
  { id: 'all', label: 'All', icon: Search },
  { id: 'people', label: 'People', icon: Users },
  { id: 'communities', label: 'Communities', icon: MessageCircle },
];

const RESULT_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, type: 'spring', stiffness: 300, damping: 30 },
  }),
};

function useDebounced(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches') || '[]');
    } catch {
      return [];
    }
  });
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const user = useAppStore((s) => s.user);
  const cityId = user?.city?.id;

  const debouncedQuery = useDebounced(query, 300);

  const { data: results, isLoading, isError } = useQuery({
    queryKey: ['search', debouncedQuery, cityId],
    queryFn: () => searchApi.search(debouncedQuery, cityId).then((r) => r.data),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 60000,
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const removeRecentSearch = (term) => {
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = (term) => {
    const searchTerm = term || query;
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm.trim());
      setQuery(searchTerm);
      setIsFocused(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const hasQuery = debouncedQuery.trim().length > 0;
  const people = results?.people || results?.users || [];
  const communities = results?.communities || [];
  const totalResults = people.length + communities.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Search" description="Search for communities, people, and topics in your area." path="/search" />
      {/* Search Header */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-30">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-sm">
              <Search className="w-4 h-4 text-white" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search people, communities..."
              className="w-full pl-14 pr-12 py-3.5 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white border border-gray-100 transition-all shadow-sm"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 mt-4 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5">
        <AnimatePresence mode="wait">
          {/* Recent Searches */}
          {!hasQuery && isFocused && recentSearches.length > 0 && (
            <motion.div
              key="recent"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  Recent Searches
                </h3>
                <button onClick={clearRecentSearches} className="text-xs font-medium text-gray-400 hover:text-pink-500 transition-colors">
                  Clear all
                </button>
              </div>
              <div className="space-y-0.5">
                {recentSearches.map((term) => (
                  <div key={term} className="flex items-center justify-between group">
                    <button
                      onClick={() => { setQuery(term); handleSearch(term); }}
                      className="flex items-center gap-2.5 py-2.5 px-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl flex-1 text-left transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-300" />
                      {term}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeRecentSearch(term); }}
                      className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty state when no query */}
          {!hasQuery && !isFocused && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
                <Search className="w-9 h-9 text-pink-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1.5">Search NearbyConnect</h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">Find people and communities in your city</p>
            </motion.div>
          )}

          {/* Loading */}
          {hasQuery && isLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-400 font-medium">Searching...</p>
            </motion.div>
          )}

          {/* Error */}
          {hasQuery && isError && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-red-50 flex items-center justify-center">
                <X className="w-9 h-9 text-red-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Search failed</h3>
              <p className="text-sm text-gray-400">Something went wrong. Please try again.</p>
            </motion.div>
          )}

          {/* Results */}
          {hasQuery && !isLoading && !isError && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-xs text-gray-400 mb-4 font-medium">
                {totalResults === 0
                  ? `No results for "${debouncedQuery}"`
                  : `${totalResults} result${totalResults !== 1 ? 's' : ''} for "${debouncedQuery}"`}
              </p>

              {totalResults === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gray-50 flex items-center justify-center">
                    <Search className="w-9 h-9 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">No results found</h3>
                  <p className="text-sm text-gray-400">Try different keywords or browse communities</p>
                </div>
              )}

              {/* People */}
              {(activeTab === 'all' || activeTab === 'people') && people.length > 0 && (
                <div className="mb-6">
                  {activeTab === 'all' && (
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2 px-1">
                      <Users className="w-3.5 h-3.5" /> People
                    </h3>
                  )}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                    {people.map((person, i) => (
                      <motion.div
                        key={person.id}
                        custom={i}
                        variants={RESULT_VARIANTS}
                        initial="hidden"
                        animate="visible"
                        className="flex items-center gap-3.5 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate('/profile')}
                      >
                        <Avatar emoji={person.avatarEmoji} name={person.anonymousName} size="md" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900">{person.anonymousName}</h4>
                          <p className="text-xs text-gray-400 truncate mt-0.5">{person.bio || 'No bio yet'}</p>
                        </div>
                        {person.city && (
                          <span className="text-xs text-gray-400 flex-shrink-0 flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            {person.city.name}
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Communities */}
              {(activeTab === 'all' || activeTab === 'communities') && communities.length > 0 && (
                <div className="mb-6">
                  {activeTab === 'all' && (
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2 px-1">
                      <MessageCircle className="w-3.5 h-3.5" /> Communities
                    </h3>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {communities.map((community, i) => (
                      <motion.div
                        key={community.id}
                        custom={i}
                        variants={RESULT_VARIANTS}
                        initial="hidden"
                        animate="visible"
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer"
                        onClick={() => navigate(`/community/${community.id}`)}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-bold text-sm text-gray-800">{community.name}</h4>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{community.description}</p>
                        <div className="flex items-center justify-center gap-1 mt-2.5 text-xs text-gray-400">
                          <Users className="w-3 h-3" />
                          {community.memberCount?.toLocaleString()} members
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
