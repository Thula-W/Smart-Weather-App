import React from "react";
import { WeatherResponse, DailyForecast } from "../types";

interface WeatherDisplayProps {
  weather: WeatherResponse | null;
  loading: boolean;
}

const formatDate = (dt: number) =>
  new Date(dt * 1000).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather, loading }) => {
  if (loading && !weather) {
    return (
      <div className="glass rounded-3xl p-12 flex flex-col items-center justify-center space-y-4 min-h-[400px]">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        <p className="text-white/60 font-medium">
          Synchronizing with atmosphere...
        </p>
      </div>
    );
  }

  if (!weather) return null;

  const { currentWeather, dailyForecast, city, country } = weather;

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <div className="glass rounded-3xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {city}{country && `, ${country}`}
            </h2>
            <p className="capitalize text-sky-300">
              {currentWeather.description ? currentWeather.description : ''}
            </p>

            <div className="flex items-end gap-2 mt-4">
              <span className="text-8xl font-black">
                {Math.round(currentWeather.temp)}°
              </span>
              <span className="text-2xl text-white/30 mb-4">C</span>
            </div>

            <p className="text-sm text-white/60">
              Feels like {Math.round(currentWeather.feels_like)}°C
            </p>
          </div>

          <img
            src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
            alt={currentWeather.main}
            className="w-40 h-40"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/10 pt-6">
          <Stat label="UV Index" value={currentWeather.uvi.toString()} />
          <Stat label="Wind" value={currentWeather.wind_speed.toString()} unit="km/h" />
          <Stat label="Humidity" value={currentWeather.humidity.toString()} unit="%" />
          <Stat label="Visibility" value={currentWeather.visibility.toString()} unit="m" />
        </div>
      </div>

      {/* Forecast */}
      <h3 className="text-lg font-bold text-white/60 uppercase px-2">
        7-Day Forecast
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {dailyForecast.slice(0, 7).map((day: DailyForecast, idx) => (
          <div
            key={idx}
            className="glass rounded-3xl p-5 border border-white/5"
          >
            <div className="flex justify-between mb-4">
              <span className="font-bold text-white">
                {formatDate(day.dt)}
              </span>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                alt={day.main}
                className="w-10 h-10"
              />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-black">
                {Math.round(day.temp_max)}°
              </span>
              <span className="text-sm text-white/60">
                {Math.round(day.temp_min)}°C
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-center border-t border-white/5 pt-3">
              <MiniStat label="POP" value={`${day.pop}%`} />
              <MiniStat label="Rain" value={`${day.rain || 0} mm`} />
              <MiniStat label="UV" value={day.uvi.toString()} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Stat = ({
  label,
  value,
  unit = ""
}: {
  label: string;
  value: string;
  unit?: string;
}) => (
  <div className="bg-white/5 p-4 rounded-2xl text-center">
    <span className="text-[10px] uppercase text-white/30">{label}</span>
    <div className="text-2xl font-black text-white">
      {value}
      <span className="text-xs text-white/30 ml-1">{unit}</span>
    </div>
  </div>
);

const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="block text-[9px] uppercase text-white/30">{label}</span>
    <span className="font-bold text-white">{value}</span>
  </div>
);

export default WeatherDisplay;


// import React from 'react';
// import { WeatherResponse, ForecastDay, DailyForecast } from '../types';

// interface WeatherDisplayProps {
//   weather: WeatherResponse | null;
//   loading: boolean;
// }

// const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather, loading }) => {
//   if (loading && !weather) {
//     return (
//       <div className="glass rounded-3xl p-12 flex flex-col items-center justify-center space-y-4 min-h-[400px]">
//         <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
//         <p className="text-white/60 font-medium">Synchronizing with atmosphere...</p>
//       </div>
//     );
//   }

//   if (!weather) return null;

//   const renderRainOrSnow = (day: DailyForecast) => {
//     if (day.snow && day.snow > 0) {
//       return { label: 'SNOW', value: `${day.snow} mm` };
//     }
//     return { label: 'RAIN', value: `${day.rain || 0} mm` };
//   };

//   return (
//     <div className="space-y-6">
//       {/* Current Day Detailed Hero */}
//       <div className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
//         <div className="relative z-10 flex flex-row justify-between items-center mb-6">
//           <div className="flex-1">
//             <div className="flex items-center gap-2 mb-1">
//               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
//               <h2 className="text-xl md:text-2xl font-bold text-white/90">{weather.city}</h2>
//             </div>
//             <p className="text-sm md:text-base text-white/50 capitalize mb-2">{weather.dailyForecast[0]?.dt}</p>
//             <p className="text-lg text-sky-300 capitalize font-medium mb-4">{weather.description}</p>
            
//             <div className="flex items-end gap-2">
//               <span className="text-7xl md:text-9xl font-black tracking-tighter leading-none">{Math.round(weather.temperature)}°</span>
//               <span className="text-2xl md:text-3xl font-bold text-white/20 mb-4">C</span>
//             </div>
//           </div>
          
//           <div className="flex flex-col items-center md:items-end shrink-0">
//             <img 
//               src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`} 
//               alt={weather.condition}
//               className="w-32 h-32 md:w-56 md:h-56 drop-shadow-2xl animate-pulse"
//             />
//             <div className="glass px-4 py-2 rounded-2xl text-xs md:text-sm font-bold bg-white/5 border-white/10 -mt-4 md:-mt-8">
//               Feels like {Math.round(weather.feelsLike)}°C
//             </div>
//           </div>
//         </div>

//         {/* Hero Quick Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/10 pt-6">
//           <StatBox label="UV Index" value={weather.dailyForecast[0]?.uvIndex.toString() || '0'} unit="" color="text-orange-400" />
//           <StatBox label="Wind" value={weather.windSpeed.toString()} unit="km/h" />
//           <StatBox label="Humidity" value={weather.humidity.toString()} unit="%" />
//           <StatBox label="Rain Chance" value={`${weather.dailyForecast[0]?.pop}%`} unit="" />
//         </div>
//       </div>

//       {/* 7-Day dailyForecast Grid */}
//       <h3 className="text-lg font-bold text-white/60 px-2 tracking-wide uppercase">Upcoming Forecast</h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {weather.dailyForecast.slice(1, 7).map((day, idx) => {
//           const rainSnowData = renderRainOrSnow(day);
//           return (
//             <div key={idx} className="glass rounded-3xl p-5 flex flex-col transition-all hover:bg-white/10 hover:scale-[1.02] border border-white/5">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="flex flex-col">
//                   <span className="text-white font-bold">{day.dayName}</span>
//                   <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{day.date.split(',')[1]}</span>
//                 </div>
//                 <img 
//                   src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
//                   alt={day.condition}
//                   className="w-10 h-10 drop-shadow-md"
//                 />
//               </div>
              
//               <div className="flex items-center gap-3 mb-4">
//                 <span className="text-3xl font-black">{Math.round(day.tempMax)}°</span>
//                 <span className="text-sm font-bold text-white/70">{Math.round(day.tempMin)}°c</span>
//                 <div className="ml-auto text-right">
//                   <p className="text-[10px] font-bold text-sky-400 truncate max-w-[80px]">{day.condition}</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-3 gap-0 mt-auto border-t border-white/5 pt-3">
//                 <div className="flex flex-col items-center border-r border-white/5">
//                   <span className="text-[8px] text-white/30 font-bold uppercase">Precip</span>
//                   <span className="text-xs font-bold">{day.pop}%</span>
//                 </div>
//                 <div className="flex flex-col items-center border-r border-white/5">
//                   <span className="text-[8px] text-white/30 font-bold uppercase">{rainSnowData.label}</span>
//                   <span className="text-xs font-bold">{rainSnowData.value}</span>
//                 </div>
//                 <div className="flex flex-col items-center">
//                   <span className="text-[8px] text-white/30 font-bold uppercase">UV</span>
//                   <span className="text-xs font-bold">{day.uvIndex}</span>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// const StatBox = ({ label, value, unit, color = "text-white" }: { label: string, value: string, unit: string, color?: string }) => (
//   <div className="flex flex-col bg-white/5 p-4 rounded-2xl border border-white/5">
//     <span className="text-white/30 text-[10px] uppercase tracking-widest mb-1 font-bold">{label}</span>
//     <div className="flex items-baseline gap-1">
//       <span className={`text-xl md:text-2xl font-black ${color}`}>{value}</span>
//       <span className="text-xs text-white/20 font-bold uppercase">{unit}</span>
//     </div>
//   </div>
// );

// export default WeatherDisplay;
