import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, Check, Tag } from 'lucide-react';
import { interestApi } from '../../services/api';

export default function InterestSelector({ value = [], onChange, placeholder = 'Search interests...', multi = true }) {
  const [allInterests, setAllInterests] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    interestApi.getAll()
      .then((res) => {
        setAllInterests(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = allInterests.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.category && i.category.toLowerCase().includes(search.toLowerCase()))
  );

  const categories = [...new Set(filtered.map((i) => i.category).filter(Boolean))];

  const isSelected = (name) => {
    if (multi) return value.includes(name);
    return value === name;
  };

  const toggleInterest = (name) => {
    if (multi) {
      const next = value.includes(name) ? value.filter((v) => v !== name) : [...value, name];
      onChange(next);
    } else {
      onChange(value === name ? null : name);
      setOpen(false);
      setSearch('');
    }
  };

  const removeInterest = (name) => {
    if (multi) {
      onChange(value.filter((v) => v !== name));
    } else {
      onChange(null);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected chips */}
      {multi && value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {value.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-50 text-pink-600 text-xs font-semibold rounded-lg border border-pink-100"
            >
              <Sparkles className="w-3 h-3" />
              {name}
              <button onClick={() => removeInterest(name)} className="ml-0.5 hover:text-pink-800">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={multi && value.length > 0 ? `${value.length} selected — add more...` : placeholder}
          className="w-full pl-10 pr-10 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 border border-gray-100 transition-all"
        />
        {search && (
          <button onClick={() => { setSearch(''); }} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <div key={cat}>
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-1.5">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{cat}</span>
                      </div>
                      {filtered
                        .filter((i) => i.category === cat)
                        .map((interest) => (
                          <button
                            key={interest.id}
                            onClick={() => toggleInterest(interest.name)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-all ${
                              isSelected(interest.name)
                                ? 'bg-pink-50 text-pink-600 font-semibold'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected(interest.name) ? 'bg-pink-100' : 'bg-gray-100'
                            }`}>
                              <Sparkles className={`w-3 h-3 ${isSelected(interest.name) ? 'text-pink-500' : 'text-gray-400'}`} />
                            </div>
                            <span className="flex-1 truncate">{interest.name}</span>
                            {isSelected(interest.name) && <Check className="w-4 h-4 text-pink-500 shrink-0" />}
                          </button>
                        ))}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs text-gray-400">No interests found</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
