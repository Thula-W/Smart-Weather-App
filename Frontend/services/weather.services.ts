import dotenv from 'dotenv'
import {WeatherResponse } from '../types';

dotenv.config()
const BASE_URL = process.env.WEATHER_ENDPOINT;

export const weatherService = {
  async getByCity(city: string): Promise<WeatherResponse> {
    const response = await fetch(
      `${BASE_URL}?type=CITY&city=${encodeURIComponent(city)}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch weather");
    }

    return response.json();
  },

  async getByZip(zip: string, country: string): Promise<WeatherResponse> {
    const response = await fetch(
      `${BASE_URL}?type=ZIP&zip=${encodeURIComponent(zip)},${encodeURIComponent(country)}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch weather");
    }

    return response.json();
  },

  async getByCoords(lat: number, lon: number): Promise<WeatherResponse> {
    const response = await fetch(
      `${BASE_URL}?type=COORD&lat=${lat}&lon=${lon}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch weather");
    }

    return response.json();
  }
};
