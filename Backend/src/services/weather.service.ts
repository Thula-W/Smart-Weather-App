import axios from "axios";
import {  Request, Response } from "express";


// ----------------- Helper functions -----------------------
const getCurrentWeather = async (lat: number, lon: number) => {
    try {
        const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                lat: lat,
                lon: lon,
                units: 'metric',
                appid: process.env.OPENWEATHER_API_KEY
            }
        }); 
        return {
            city: weatherResponse.data.name,
            temperature: weatherResponse.data.main.temp,
            description: weatherResponse.data.weather[0].description,
            humidity: weatherResponse.data.main.humidity,
            windSpeed: weatherResponse.data.wind.speed
        };      
    } catch (error) {
        throw error;
    }

}

const getForecastWeather = async (lat: number, lon: number) => {
    try {
        const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
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
        const geoResponse = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
            params: {
                q: city,
                limit: 1,
                appid: process.env.OPENWEATHER_API_KEY
            }
        });

        if (geoResponse.data.length === 0) {
            throw new Error("city cordinates not found");
        }
        const {lat, lon} = geoResponse.data[0];
        return {lat, lon};

    } catch (error) {
        throw error;
    }
}

const getCordinatesByZip = async (zip: string) => {
    try {
        const geoResponse = await axios.get('http://api.openweathermap.org/geo/1.0/zip', {
            params: {
                zip: zip,
                appid: process.env.OPENWEATHER_API_KEY
            }
        });

        if (geoResponse.data.length === 0) {
            throw new Error("city cordinates not found");
        }
        const {lat, lon} = geoResponse.data;
        return {lat, lon};

    } catch (error) {
        throw error;
    }
}

// ----------------- Functions to get current weather -------------------

export const getWeatherByCity = async (req: Request, res: Response) => {
    const city = req.query.city as string;
    if (!city) {
        throw new Error("City is required");
    }

    try {
        const coords = await getCordinatesByCity(city);
        const weatherData = await getCurrentWeather(coords.lat, coords.lon);

        res.json(weatherData);

    } catch (error :any ) {
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : "Internal Server Error";
        
        res.status(status).json({ error: message });
    }
};

export const getWeatherByCoordinates = async (req: Request, res: Response) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    if (!lat || !lon) {
        throw new Error("Coordinates are required");
    }

    try {
        const weatherData =  await getCurrentWeather(Number(lat), Number(lon));
        res.json(weatherData);

    } catch (error :any ) {
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : "Internal Server Error";
        
        res.status(status).json({ error: message });
    }
};

export const getWeatherByZip = async (req: Request, res: Response) => {
    const zip = req.query.zip as string;
    if (!zip) {
        throw new Error("Zip code is required");
    }

    try {
        const coords = await getCordinatesByZip(zip);
        const weatherData = await getCurrentWeather(coords.lat, coords.lon);
        res.json(weatherData);

    } catch (error :any ) {
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : "Internal Server Error";
        
        res.status(status).json({ error: message });
    }
};

// ----------------- Functions to get forecast weather (5 day, 3 hrs) -------------------

export const getForecastByCity = async (req: Request, res: Response) => {
    const city = req.query.city as string;
    if (!city) {
        throw new Error("City is required");
    }

    try {
        const coords = await getCordinatesByCity(city);
        const weatherData = await getForecastWeather(coords.lat, coords.lon);
        res.json(weatherData);

    } catch (error :any ) {
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : "Internal Server Error";
        
        res.status(status).json({ error: message });
    }
};

export const getForecastByCoordinates = async (req: Request, res: Response) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    if (!lat || !lon) {
        throw new Error("Coordinates are required");
    }

    try {
        const weatherData =  await getForecastWeather(Number(lat), Number(lon));
        res.json(weatherData);

    } catch (error :any ) {
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : "Internal Server Error";
        
        res.status(status).json({ error: message });
    }
};

export const getForecastByZip = async (req: Request, res: Response) => {
    const zip = req.query.zip as string;
    if (!zip) {
        throw new Error("Zip code is required");
    }

    try {
        const coords = await getCordinatesByZip(zip);
        const weatherData = await getForecastWeather(coords.lat, coords.lon);
        res.json(weatherData);

    } catch (error :any ) {
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : "Internal Server Error";
        
        res.status(status).json({ error: message });
    }
};
