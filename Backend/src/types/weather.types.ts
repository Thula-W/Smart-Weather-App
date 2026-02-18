export interface CurrentWeather {
//   dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  uvi: number;
  wind_speed: number;
  visibility: number;
  main: string;
  description: string;
  icon: string;
  rain?: number;
  snow?: number;
}

export interface DailyForecast {
  dt: number;
  summary: string;
  temp_min: number;
  temp_max: number;
  main: string;
  description: string;
  icon: string;
  pop: number; // Probability of precipitation
  rain: number;
  wind_speed: number;
  humidity: number;
  uvi: number;
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

export interface HistoryWeather {
  city: string;
  date: string;
  temp_max: number;
  temp_min: number;
  temp_morning: number;
  temp_evening: number;
  temp_afternoon: number;
  temp_night: number;
  precipitation: number;
  humidity: number;
  wind_max_speed: number;
  cloud_cover: number;
}