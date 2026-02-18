
import React, { useState, useEffect } from 'react';
import { SearchMode } from '../types';

interface SearchSectionProps {
  onSearch: (params: { mode: SearchMode; city?: string; zip?: string; country?: string; lat?: number; lon?: number }) => void;
  loading: boolean;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onSearch, loading }) => {
  const [mode, setMode] = useState<SearchMode>('CITY');
  const [query, setQuery] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [countryCode, setCountryCode] = useState('LK');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'CITY') {
      if (!query.trim()) return;
      onSearch({ mode: 'CITY', city: query });
    } else if (mode === 'ZIP') {
      if (!query.trim()) return;
      onSearch({ mode: 'ZIP', zip: query, country: countryCode });
    } else if (mode === 'COORD') {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);
      if (!isNaN(latitude) && !isNaN(longitude)) {
        onSearch({ mode: 'COORD', lat: latitude, lon: longitude });
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <div className="flex gap-2 p-1 bg-white/10 backdrop-blur-md rounded-lg self-center md:self-end">
        {(['CITY', 'ZIP', 'COORD'] as SearchMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-white/70 hover:text-white'
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="relative flex gap-2">
        {mode !== 'COORD' ? (
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/50 group-focus-within:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={mode === 'CITY' ? "Enter city name..." : "Enter zip code..."}
              className="w-full pl-10 pr-4 py-3 bg-white/10 hover:bg-white/20 focus:bg-white/20 outline-none border border-white/20 rounded-xl backdrop-blur-md transition-all placeholder:text-white/40"
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
            onChange={(e) => setCountryCode(e.target.value)}
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
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchSection;
