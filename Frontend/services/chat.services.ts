import { CurrentWeather } from "../types";

const BASE_URL = "http://localhost:5000/api/chat";

export type ChatResponse = {
  text: string;
  responseId?: string;
};

export const chatService = {
  async sendMessage(
    input: string,
    weatherData: CurrentWeather | null,
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
        weatherData
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Chat request failed");
    }

    return data;
  }
};
