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
          <Stat label="Wind" value={currentWeather.wind_speed.toString()} unit="km/h" />
          <Stat label="Humidity" value={currentWeather.humidity.toString()} unit="%" />
          {currentWeather.snow ? <Stat label="Snow" value={`${currentWeather.snow}`} unit="mm/h" />
          : <Stat label="Rain" value={`${currentWeather.rain || 0}`} unit=" mm/h" />}
          <Stat label="UV Index" value={currentWeather.uvi.toString()} />
        </div>
      </div>


      {/* Forecast */}
      <h3 className="text-lg font-bold text-white/60 uppercase px-2">
        Next Week Forecast
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {dailyForecast.slice(1, 7).map((day: DailyForecast, idx) => (
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

            <div className="flex items-center gap-5 mb-4">
              <span className="text-3xl font-black">
                {Math.round(day.temp_max)}°C
              </span>
              <span className="text-sm text-white/60">
                {Math.round(day.temp_min)}°C
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 text-xs text-center border-t border-white/5 pt-3">
              {day.snow ? <MiniStat label="Snow" value={`${day.snow.toFixed(1)} mm/h`} />
              : <MiniStat label="Rain" value={`${day.rain?.toFixed(1) || 0} mm/h`} />}
              <MiniStat label="POP" value={`${day.pop}%`} />
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