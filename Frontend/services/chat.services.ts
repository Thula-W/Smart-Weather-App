import dotenv from 'dotenv'
import { CurrentWeather, ChatResponse, DailyForecast } from "../types";

dotenv.config()
const BASE_URL = process.env.CHAT_ENDPOINT;

export const chatService = {
  async sendMessage(
    input: string,
    weatherData: CurrentWeather | null,
    futureWeatherData: DailyForecast[],
    previousResponseId?: string,
    flavor: "Default" | "Historian" = "Default"
  ): Promise<ChatResponse> {

    const tag = flavor === "Historian" ? "historian" : "default";

    const response = await fetch(`${BASE_URL}?tag=${tag}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input,
        previousResponseId,
        weatherData,
        futureWeatherData
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Chat request failed");
    }

    return data;
  }
};
