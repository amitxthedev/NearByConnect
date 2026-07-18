import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Globe, MapPin, Search, X, Loader2 } from 'lucide-react';
import { cityApi } from '../../services/api';

export default function CitySelector({ value, onChange, placeholder = 'Select your city' }) {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [open, setOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const countryRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    cityApi.getCountries()
      .then((res) => {
        setCountries(res.data || []);
        setLoadingCountries(false);
      })
      .catch(() => {
        setCountries([]);
        setLoadingCountries(false);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry && selectedCountry.trim()) {
      setLoadingCities(true);
      cityApi.getByCountry(selectedCountry)
        .then((res) => {
          setCities(res.data || []);
          setLoadingCities(false);
        })
        .catch(() => {
          setCities([]);
          setLoadingCities(false);
        });
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (value && countries.length > 0 && !selectedCountry) {
      cityApi.getByCountry('')
        .then(() => {})
        .catch(() => {});
      const allCities = cities.length > 0 ? cities : [];
      const found = allCities.find((c) => c.name === value);
      if (found) setSelectedCountry(found.country);
    }
  }, [value, countries]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setCountryOpen(false);
        setCitySearch('');
        setCountrySearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setCountryOpen(false);
    setCountrySearch('');
    onChange(null);
  };

  const handleCitySelect = (city) => {
    onChange(city);
    setOpen(false);
    setCitySearch('');
  };

  const selectedCityObj = cities.find((c) => c.name === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 border border-gray-100 transition-all hover:border-gray-200"
      >
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
          <span className={value ? 'text-gray-700 font-medium' : 'text-gray-400'}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {/* Country Selector */}
            <div className="p-3 border-b border-gray-100">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Country</label>
              {loadingCountries ? (
                <div className="flex items-center justify-center py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="relative" ref={countryRef}>
                  <button
                    onClick={() => setCountryOpen(!countryOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm text-left border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-gray-400" />
                      <span className={selectedCountry ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        {selectedCountry || 'Choose a country'}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${countryOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {countryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -2 }}
                        className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-hidden"
                      >
                        <div className="p-2 border-b border-gray-50">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input
                              type="text"
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              placeholder="Search countries..."
                              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-pink-300"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto max-h-36">
                          {filteredCountries.map((country) => (
                            <button
                              key={country}
                              onClick={() => handleCountrySelect(country)}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs hover:bg-gray-50 transition-colors ${
                                selectedCountry === country ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-700'
                              }`}
                            >
                              <Globe className="w-3 h-3 shrink-0" />
                              {country}
                              {selectedCountry === country && <Check className="w-3 h-3 ml-auto text-pink-500" />}
                            </button>
                          ))}
                          {filteredCountries.length === 0 && (
                            <p className="px-3 py-3 text-xs text-gray-400 text-center">No countries found</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* City Selector */}
            <div className="p-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">City</label>
              {!selectedCountry ? (
                <p className="text-xs text-gray-400 text-center py-3">Select a country first</p>
              ) : loadingCities ? (
                <div className="flex items-center justify-center py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  <div className="relative mb-2">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      placeholder="Search cities..."
                      className="w-full pl-8 pr-3 py-2 bg-gray-50 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-pink-300 border border-gray-100"
                    />
                    {citySearch && (
                      <button onClick={() => setCitySearch('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                        <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                  <div className="overflow-y-auto max-h-40 space-y-0.5">
                    {filteredCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleCitySelect(city.name)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs rounded-lg transition-all ${
                          value === city.name
                            ? 'bg-pink-500 text-white font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{city.name}</span>
                        {city.state && <span className={`text-[10px] ml-auto shrink-0 ${value === city.name ? 'text-pink-100' : 'text-gray-400'}`}>{city.state}</span>}
                        {value === city.name && <Check className="w-3 h-3 ml-auto shrink-0" />}
                      </button>
                    ))}
                    {filteredCities.length === 0 && (
                      <p className="px-3 py-3 text-xs text-gray-400 text-center">No cities found</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
