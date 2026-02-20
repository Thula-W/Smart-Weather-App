import React, { useState, useEffect } from 'react';
import { SearchMode } from '../types';

interface SearchSectionProps {
  onSearch: (params: {
    mode: SearchMode;
    city?: string;
    zip?: string;
    country?: string;
    lat?: number;
    lon?: number;
  }) => void;
  loading: boolean;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onSearch, loading }) => {
  const [mode, setMode] = useState<SearchMode>('CITY');
  const [query, setQuery] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [countryCode, setCountryCode] = useState('LK');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setQuery('');
    setLat('');
    setLon('');
  }, [mode]);


  const handleCityChange = (value: string) => {
    // Block if first character is a number
    if (value.length === 1 && /^\d$/.test(value)) {
      return;
    }
    const validPattern = /^[A-Za-z0-9\s-]*$/;

    if (validPattern.test(value)) {
      setQuery(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'CITY') {
      const trimmed = query.trim();

      if (!trimmed) {
        setError('City name is required');
        return;
      }

      setError('');
      onSearch({ mode: 'CITY', city: trimmed });
    }

    else if (mode === 'ZIP') {
      const trimmed = query.trim();

      if (!trimmed) {
        setError('Zip code is required');
        return;
      }

      setError('');
      onSearch({ mode: 'ZIP', zip: trimmed, country: countryCode.trim() });
    }

    else if (mode === 'COORD') {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        setError('Enter valid latitude and longitude');
        return;
      }

      setError('');
      onSearch({ mode: 'COORD', lat: latitude, lon: longitude });
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-md">

      {/* Mode Selector */}
      <div className="flex gap-2 p-1 bg-white/10 backdrop-blur-md rounded-lg self-center md:self-end">
        {(['CITY', 'ZIP', 'COORD'] as SearchMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              mode === m
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative flex gap-2">

        {mode !== 'COORD' ? (
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) =>
                mode === 'CITY'
                  ? handleCityChange(e.target.value)
                  : setQuery(e.target.value)
              }
              placeholder={
                mode === 'CITY'
                  ? 'Enter city name...'
                  : 'Enter zip code...'
              }
              className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 focus:bg-white/20 outline-none border border-white/20 rounded-xl backdrop-blur-md transition-all placeholder:text-white/40"
            />
          </div>
        ) : (
          <div className="flex flex-1 gap-2">
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="Latitude"
              className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 focus:bg-white/20 outline-none border border-white/20 rounded-xl backdrop-blur-md transition-all placeholder:text-white/40"
            />
            <input
              type="number"
              step="any"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="Longitude"
              className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 focus:bg-white/20 outline-none border border-white/20 rounded-xl backdrop-blur-md transition-all placeholder:text-white/40"
            />
          </div>
        )}

        {mode === 'ZIP' && (
          <input
            type="text"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
            placeholder="LK"
            className="w-16 px-2 py-3 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md text-center outline-none focus:bg-white/20 transition-all"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-sky-50 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-black/10"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            'Search'
          )}
        </button>
      </form>

      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}

    </div>
  );
};

export default SearchSection;
