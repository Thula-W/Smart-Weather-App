
import React from 'react';
import { WeatherCondition } from '../types';

interface BackgroundWrapperProps {
  condition: string;
  children: React.ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ condition, children }) => {
  const getGradient = (cond: string) => {
    switch (cond) {
      case 'Clear':
        return 'from-sky-400 via-blue-500 to-blue-600';
      case 'Clouds':
        return 'from-gray-400 via-slate-500 to-slate-700';
      case 'Rain':
      case 'Drizzle':
        return 'from-slate-700 via-indigo-900 to-slate-900';
      case 'Snow':
        return 'from-blue-100 via-blue-200 to-indigo-300';
      case 'Thunderstorm':
        return 'from-gray-900 via-purple-900 to-black';
      case 'Mist':
      case 'Fog':
      case 'Haze':
        return 'from-gray-300 via-gray-400 to-slate-500';
      default:
        return 'from-slate-800 via-slate-900 to-black';
    }
  };

  const getOverlayPattern = (cond: string) => {
    if (cond === 'Rain' || cond === 'Thunderstorm') {
      return (
        <div className="fixed inset-0 pointer-events-none opacity-20 z-0" 
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
        />
      );
    }
    return null;
  };

  return (
    <div className={`relative min-h-screen w-full transition-all duration-1000 bg-gradient-to-br ${getGradient(condition)} bg-fixed`}>
      {getOverlayPattern(condition)}
      
      {/* Decorative Blur Orbs - using fixed to follow scroll and stay in background */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;
