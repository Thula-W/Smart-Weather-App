export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  description: string;
  windSpeed: number;
}

export interface WeatherCondition {
  main: string;
  description: string;
  icon: string;
}

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