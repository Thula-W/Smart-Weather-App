
import { WeatherData, WeatherCondition, ForecastDay } from '../types';

const BASE_URL = 'http://localhost:5000/api/weather';

export const weatherService = {
  async getByCity(city: string): Promise<WeatherData> {
    try {
      const response = await fetch(`${BASE_URL}?city=${encodeURIComponent(city)}`);
      if (!response.ok) throw new Error('City not found');
      return await response.json();
    } catch (error) {
      console.error('Weather fetch error:', error);
      return mockWeatherData(city); 
    }
  },

  async getByZip(zip: string, country: string): Promise<WeatherData> {
    try {
      const response = await fetch(`${BASE_URL}/zip?zip=${encodeURIComponent(zip)}&country=${encodeURIComponent(country)}`);
      if (!response.ok) throw new Error('ZIP code not found');
      return await response.json();
    } catch (error) {
      console.error('Weather fetch error:', error);
      return mockWeatherData(`ZIP: ${zip}`);
    }
  },

  async getByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await fetch(`${BASE_URL}/coordinates?lat=${lat}&lon=${lon}`);
      if (!response.ok) throw new Error('Coordinates not found');
      return await response.json();
    } catch (error) {
      console.error('Weather fetch error:', error);
      return mockWeatherData(`Location at ${lat.toFixed(2)}, ${lon.toFixed(2)}`);
    }
  }
};

function mockWeatherData(query: string): WeatherData {
  const conditions: WeatherCondition[] = ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  
  const forecast: ForecastDay[] = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(now.getDate() + i);
    const dayName = days[date.getDay()];
    const formattedDate = `${dayName}, ${date.getDate()}${getOrdinal(date.getDate())}`;
    
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const isSnowy = condition === 'Snow';
    
    return {
      date: formattedDate,
      dayName: dayName,
      tempMin: Math.floor(Math.random() * 5) + 15,
      tempMax: Math.floor(Math.random() * 10) + 22,
      condition: condition,
      icon: i % 2 === 0 ? '01d' : '10d',
      pop: Math.floor(Math.random() * 100),
      rain: !isSnowy && Math.random() > 0.5 ? parseFloat((Math.random() * 5).toFixed(1)) : 0,
      snow: isSnowy ? parseFloat((Math.random() * 3).toFixed(1)) : 0,
      windSpeed: Math.floor(Math.random() * 25),
      humidity: Math.floor(Math.random() * 40) + 40,
      uvIndex: Math.floor(Math.random() * 11)
    };
  });

  return {
    city: query.includes('ZIP') || query.includes('Location') ? query : query,
    country: 'US',
    temperature: Math.floor(Math.random() * 15) + 20,
    feelsLike: Math.floor(Math.random() * 15) + 20,
    humidity: 65,
    windSpeed: 12,
    description: `Scattered ${randomCondition.toLowerCase()}`,
    condition: randomCondition,
    icon: '10d',
    coordinates: { lat: 40.7128, lon: -74.0060 },
    forecast: forecast
  };
}

function getOrdinal(d: number) {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}
