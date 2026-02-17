import axios from "axios";
import {  Request, Response } from "express";
import { CurrentWeather, DailyForecast, WeatherAlert} from "../types/weather.types";

const END_POINT = "https://api.openweathermap.org/data/3.0/onecall";
const GEO_ZIP = "http://api.openweathermap.org/geo/1.0/zip";
const GEO_CITY = 'http://api.openweathermap.org/geo/1.0/direct';
const REVERSE_GEO = 'http://api.openweathermap.org/geo/1.0/reverse';

// ----------------- Helper functions -----------------------
const getWeatherData = async (lat: number, lon: number) => {
    try {
        const weatherResponse = await axios.get(END_POINT, {
            params: {
                lat: lat,
                lon: lon,
                units: 'metric',
                appid: process.env.OPENWEATHER_API_KEY
            }
        }); 
        return weatherResponse.data;  

    } catch (error) {
        throw error;
    }
}

const getCordinatesByCity = async (city: string) => {
    try {
        const geoResponse = await axios.get(GEO_CITY, {
            params: {
                q: city,
                limit: 1,
                appid: process.env.OPENWEATHER_API_KEY
            }
        });
        if (geoResponse.data.length === 0) {
            throw new Error("city cordinates not found");
        }
        const {lat, lon, name, country} = geoResponse.data[0];
        return {lat, lon, city: name, country};

    } catch (error) {
        throw error;
    }
}

const getCordinatesByZip = async (zip: string) => {
    try {
        const geoResponse = await axios.get(GEO_ZIP, {
            params: {
                zip: zip,
                appid: process.env.OPENWEATHER_API_KEY
            }
        });

        if (geoResponse.data.length === 0) {
            throw new Error("city cordinates not found");
        }
        const {lat, lon, name, country} = geoResponse.data;
        return {lat, lon, city: name, country};

    } catch (error) {
        throw error;
    }
}

const getCityNameByCoords = async (lat: number, lon: number) => {
    try {
        const reverseGeoResponse = await axios.get(REVERSE_GEO, {
            params: {
                lat: lat,
                lon: lon,
                limit: 1,
                appid: process.env.OPENWEATHER_API_KEY
            }
        });

        if (reverseGeoResponse.data.length === 0) {
            throw new Error("Location name not found for these coordinates");
        }
        const { name, country } = reverseGeoResponse.data[0]; 
        return { city:name, country };

    } catch (error) {
        throw error;
    }
};

const extractCurrentWeather = (data: any): CurrentWeather => {
  const { current } = data;
  const weather = current.weather; 

  return {
    // dt: current.dt,
    temp: current.temp,
    feels_like: current.feels_like,
    humidity: current.humidity,
    uvi: current.uvi,
    wind_speed: current.wind_speed,
    visibility: current.visibility,
    main: weather.main,
    description: weather.description,
    icon: weather.icon,
  };
};

const extractDailyForecast = (data: any): DailyForecast[] => {
  return data.daily.map((day: any) => {
    const weather = day.weather;
    
    return {
      dt: day.dt,
      summary: day.summary,
      temp_min: day.temp.min,
      temp_max: day.temp.max,
      main: weather.main,
      description: weather.description,
      icon: weather.icon,
      pop: day.pop,
      rain: day.rain,
      wind_speed: day.wind_speed,
      humidity: day.humidity,
      uvi: day.uvi
    };
  });
};

const extractWeatherAlerts = (data: any): WeatherAlert[] => {
  // If no alerts, data.alerts will be undefined
  const { alerts = [] } = data;

  return alerts.map((alert: any) => ({
    sender_name: alert.sender_name,
    event: alert.event,
    start: alert.start,
    end: alert.end,
    description: alert.description,
    tags: alert.tags || [],
  }));
};

// ----------------- Main functions -------------------
export const getWeather = async (req: Request, res: Response) => {
    const type = req.query.type as string;

    try {
        let coords: { lat: number; lon: number; city?: string;  country?:string };
        switch (type) {
            case "CITY":
                const city = req.query.city as string;
                if (!city) throw new Error("City is required");
                coords = await getCordinatesByCity(city);
                break;

            case "COORD":
                const lat = req.query.lat;
                const lon = req.query.lon;
                if (!lat || !lon) throw new Error("Coordinates (lat, lon) are required");
                coords = { lat: Number(lat), lon: Number(lon) };
                coords = { ...coords, ...(await getCityNameByCoords(coords.lat, coords.lon)) };
                break;

            case "ZIP":
                const zip = req.query.zip as string;
                if (!zip) throw new Error("Zip code is required");
                coords = await getCordinatesByZip(zip);
                break;

            default:
                return res.status(400).json({ error: "Invalid retrieval method type. Use CITY, COORD, or ZIP." });
        }

        const weatherData = await getWeatherData(coords.lat, coords.lon);

        const result = {
            currentWeather: extractCurrentWeather(weatherData),
            dailyForecast: extractDailyForecast(weatherData),
            weatherAlerts: extractWeatherAlerts(weatherData),
            city: coords.city || null,
            country: coords.country || null
        };

        return res.json(result);

    } catch (error: any) {
        const status = error.response ? error.response.status : (error.message.includes("required") ? 400 : 500);
        const message = error.response ? error.response.data.message : error.message;
        
        res.status(status).json({ error: message });
    }
};
