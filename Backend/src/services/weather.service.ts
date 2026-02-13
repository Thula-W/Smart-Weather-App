import axios from "axios";
import {  Request, Response } from "express";


export const getWeatherByCity = async (req: Request, res: Response) => {
    const city = req.query.city as string;
    if (!city) {
        throw new Error("City is required");
    }

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
        const {lat, lon,name} = geoResponse.data[0];
        console.log(lat, lon, name);

        const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                lat: lat,
                lon: lon,
                units: 'metric', 
                appid: process.env.OPENWEATHER_API_KEY
            }
        });
        console.log("weatherResponse", weatherResponse.data);

        res.json({
            city: name,
            temperature: weatherResponse.data.main.temp,
            description: weatherResponse.data.weather[0].description,
            humidity: weatherResponse.data.main.humidity,
            windSpeed: weatherResponse.data.wind.speed
        });

    } catch (error :any ) {
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : "Internal Server Error";
        
        res.status(status).json({ error: message });
    }
};
