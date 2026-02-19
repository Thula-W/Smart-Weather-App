
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
  pop: number;
  rain: number;
  snow?:number;
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
export type WeatherResponse = {
  currentWeather: CurrentWeather;
  dailyForecast: DailyForecast[];
  weatherAlerts: WeatherAlert[];
  hourlyWeather: HourlyWeather[];
  city: string | null;
  country: string | null;
};

export interface HourlyWeather {
  dt: number;
  temp: number;
  rain? :number;
  snow? : number
}
//------------------------------------------------------
export type ChatResponse = {
  result: string;
  lastResponseId?: string;
};

export type WeatherCondition = 
  | 'Clear' 
  | 'Clouds' 
  | 'Rain' 
  | 'Drizzle' 
  | 'Thunderstorm' 
  | 'Snow' 
  | 'Mist' 
  | 'Smoke' 
  | 'Haze' 
  | 'Dust' 
  | 'Fog' 
  | 'Sand' 
  | 'Ash' 
  | 'Squall' 
  | 'Tornado';

export interface ForecastDay {
  date: string;
  dayName: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
  pop: number; // Probability of precipitation
  rain?: number; // Rain volume in mm
  snow?: number; // Snow volume in mm
  windSpeed: number;
  humidity: number;
  uvIndex: number;
}

export type ChatFlavor = 'Default' | 'Historian';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  responseId?: string;
}

export type SearchMode = 'CITY' | 'ZIP' | 'COORD';
