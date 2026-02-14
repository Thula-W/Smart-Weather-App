import dotenv from "dotenv";
import OpenAI from "openai";
import { WeatherData } from "../types/weather.types";
import { Request, Response } from "express";


dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateWeatherResponse = async (
    weather: WeatherData,
    question: string
    ): Promise<string> => {
    console.log(process.env.OPENAI_API_KEY);
    if (!question) {
        throw new Error("Question is required");
    }

    const prompt = `
    You are a professional weather assistant.

    Rules:
    - Only answer weather-related questions.
    - If unrelated, politely refuse.
    - Use only provided weather data.

    Weather Data:
    Temperature: ${weather.temperature}°C
    Humidity: ${weather.humidity}%
    Condition: ${weather.description}
    Wind Speed: ${weather.windSpeed} m/s

    City: ${weather.city}
    User Question:
    ${question}
    `;

    try {
        const completion = await client.responses.create({
        model: "gpt-4o-mini",
        input: [
            { role: "system", content: "You are a professional weather assistant." },
            { role: "user", content: prompt }
        ],
        temperature: 0.7
        });

        return completion.output_text ?? "No response generated.";

    } catch (error: any) {
        console.log(error.message)
        throw new Error("Failed to generate AI response");
    }
};

export const handleWeatherChat = async (req: Request, res: Response) => {
  try {

    const { weather, question} = req.body;
    if (!weather || !question) {
      return res.status(400).json({
        error: "Weather data and question are required"
      });
    }

    const answer = await generateWeatherResponse(weather, question);

    res.json({ answer });

  } catch (error: any) {
    res.status(500).json({
      error: error.message
    });
  }
}
