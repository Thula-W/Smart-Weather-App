
import React, { useState, useEffect, useCallback } from 'react';
import { WeatherResponse, SearchMode } from './types';
import { weatherService } from './services/weather.services';
import SearchSection from './components/SearchSection';
import WeatherDisplay from './components/WeatherDisplay';
import ChatPanel from './components/ChatPanel';
import BackgroundWrapper from './components/BackgroundWrapper';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (params: { mode: SearchMode; city?: string; zip?: string; country?: string; lat?: number; lon?: number }) => {
    setLoading(true);
    setError(null);
    try {
      let data: WeatherResponse;
      switch (params.mode) {
        case 'CITY':
          data = await weatherService.getByCity(params.city!);
          break;
        case 'ZIP':
          data = await weatherService.getByZip(params.zip!, params.country!);
          break;
        case 'COORD':
          data = await weatherService.getByCoords(params.lat!, params.lon!);
          break;
        default:
          throw new Error('Invalid search mode');
      }
      setWeather(data);
    } catch (err) {
      setError('Could not fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load with geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather({ mode: 'COORD', lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {
          // Fallback if permission denied
          fetchWeather({ mode: 'CITY', city: 'London' });
        }
      );
    } else {
      fetchWeather({ mode: 'CITY', city: 'London' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BackgroundWrapper condition={weather?.currentWeather?.main || 'Clear'}>
      <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8">
        <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19a4.5 4.5 0 0 0 2.5-8.242 8 8 0 1 0-15 4.242 4.5 4.5 0 0 0 2.5 8.242" /><path d="M12 13v8" /><path d="m8 17 4 4 4-4" /></svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">SkyCast <span className="text-sky-300">AI</span></h1>
          </div>
          <SearchSection onSearch={fetchWeather} loading={loading} />
        </header>

        <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8 animate-fade-in">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl text-center">
                {error}
              </div>
            )}
            <WeatherDisplay weather={weather} loading={loading} />
          </div>
          
          <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <ChatPanel weatherContext={weather} />
          </div>
        </main>
        
        <footer className="mt-auto pt-12 pb-6 text-white/60 text-sm">
          <p>© 2024 SkyCast AI • Smart Weather Intelligence</p>
        </footer>
      </div>
    </BackgroundWrapper>
  );
};

export default App;
