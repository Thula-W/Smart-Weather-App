
import React, { useState, useEffect,useRef } from 'react';
import { WeatherResponse, SearchMode } from './types';
import { weatherService } from './services/weather.services';
import SearchSection from './components/SearchSection';
import WeatherDisplay from './components/WeatherDisplay';
import ChatPanel from './components/ChatPanel';
import BackgroundWrapper from './components/BackgroundWrapper';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const [showButton, setShowButton] = useState(true);

  const fetchWeather = async (params: { mode: SearchMode; city?: string; zip?: string; country?: string; lat?: number; lon?: number }, isInitial: boolean = false) => {
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
      if (isInitial) {
        setIsInitialized(true);
      }
    } catch (err) {
      setError('Could not fetch weather data. Please try again.');
      console.error(err);
      if (isInitial) {
        setIsInitialized(true);
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather({ mode: 'COORD', lat: pos.coords.latitude, lon: pos.coords.longitude }, true);
        },
        () => {
          fetchWeather({ mode: 'CITY', city: 'Colombo' }, true);
        }
      );
    } else {
      fetchWeather({ mode: 'CITY', city: 'Colombo' }, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowButton(!entry.isIntersecting);
      },
      {
        threshold: 0.3, 
      }
    );

    if (chatRef.current) {
      observer.observe(chatRef.current);
    }

    return () => {
      if (chatRef.current) {
        observer.unobserve(chatRef.current);
      }
    };
  }, []);

  return (
    <BackgroundWrapper condition={weather?.currentWeather?.main || "Clear"}>
      <div className="min-h-screen w-full flex flex-col items-center px-4 md:px-8">
        
        {!isInitialized ? (
          <div className="w-full h-screen flex flex-col items-center justify-center gap-6">
            <div className="flex items-center gap-3 justify-center">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                SkyCast <span className="text-sky-300">AI</span>
              </h1>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-400 border-r-sky-300 animate-spin"></div>
              </div>
              <p className="text-white/80 text-lg">Using Geo Location...</p>
            </div>
          </div>
        ) : (
          <>
            <header className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-12 mt-6 gap-4 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  SkyCast <span className="text-sky-300">AI</span>
                </h1>
              </div>
              <SearchSection onSearch={fetchWeather} loading={loading} />
            </header>

            <main className="w-full max-w-4xl flex flex-col items-center gap-16">
              <div className="w-full">
                <WeatherDisplay weather={weather} loading={loading} />
              </div>

              <div
                ref={chatRef}
                id="chat-section"
                className="w-full pb-20"
              >
                <div className="w-full max-h-[70vh] overflow-hidden rounded-2xl backdrop-blur-lg">
                  <ChatPanel weatherContext={weather} />
                </div>
              </div>

            </main>

            {showButton && (
              <button
                onClick={() => {
                  chatRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="fixed bottom-6 right-6 z-50 
                           bg-white/20 backdrop-blur-lg 
                           border border-white/30 
                           text-white px-6 py-3 
                           rounded-full shadow-2xl 
                           transition-all duration-300 
                           hover:bg-white/30 hover:scale-105"
              >
                💬 Chat
              </button>
            )}
          </>
        )}
      </div>
    </BackgroundWrapper>
  );
};

export default App;
