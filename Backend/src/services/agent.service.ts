import dotenv from "dotenv";
import OpenAI from "openai";
import { Request, Response } from "express";
import { getHistoryWeatherTool } from "./weather.service";
import { DEFAULT_AGENT_PROMPT, HISTORIAN_AGENT_PROMPT } from "../utils/agent.prompts";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// guardrail to check if the input is weather related before processing with the agent
const isWeatherRelated = async (input: string): Promise<boolean> => {
  const check = await client.responses.create({
    model: "gpt-4o-mini",
    input: `Is the following query related to weather, clothing for weather, or weather-impacted activities like sports/gardening etc? 
    Query: "${input}" 
    Answer only 'yes' or 'no'.`,
    store: false
  });

  return check.output_text.toLowerCase().includes("yes");
};

//---------- This agent is responsible for historcial weather quearies----------------
const handleHistorianAgent = async (
  input: string,
  previousResponseId: string | undefined,
  res: Response
) => {
  try {
    const tools = [
      {
        type: "function" as const,
        name: "getHistoryWeatherTool",
        description: "Get weather summary for a city on a specific date.",
        parameters: {
          type: "object",
          properties: {
            city: { type: "string" },
            date: {
              type: "string",
              description: "Date in format YYYY-MM-DD"
            }
          },
          required: ["city", "date"],
           additionalProperties: false
        },
        strict: true
      }
    ];
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      ...(previousResponseId && { previous_response_id: previousResponseId }),
      input,
      tools,
      store: true
    });
    const toolCall = response.output.find(
      (item) => item.type === "function_call"
    );

    if (toolCall && toolCall.type === "function_call") {
      const { city, date } = JSON.parse(toolCall.arguments);
      const data = await getHistoryWeatherTool(city, date);
      const final = await client.responses.create({
        model: "gpt-4o-mini",
        previous_response_id: response.id,
        input: [
          {
            type: "function_call_output",
            call_id: toolCall.call_id,
            output: JSON.stringify(data)
          }
        ],
        instructions: HISTORIAN_AGENT_PROMPT
      });

      return res.json({
        result: final.output_text,
        lastResponseId: final.id
      });
    }

    return res.json({
      result: response.output_text,
      lastResponseId: response.id
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};


const handleDefaultAgent = async (
  input: string,
  previousResponseId: string | undefined,
  currentWeatherData: any,
  res: Response
) => {
  try {
    const contextPrompt = previousResponseId
      ? input
      : `You are friendly weather assistant.Help user with his questions. Here is the Current Weather Data: ${JSON.stringify(
          currentWeatherData
        )}\nUser Question: ${input}`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      ...(previousResponseId && { previous_response_id: previousResponseId }),
      input: contextPrompt,
      store: true,
      instructions: DEFAULT_AGENT_PROMPT
    });

    return res.json({
      result: response.output_text,
      lastResponseId: response.id
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// ---------------------------------------------------------------------
export const chatWithAssistant = async (req: Request, res: Response) => {
  try {
    const { input, previousResponseId, weatherData } = req.body;
    const tag = req.query.tag as string;

    if (!input) {
      return res.status(400).json({ error: "Input is required." });
    }

    const weatherCheck = await isWeatherRelated(input);
    if (!weatherCheck) {
      return res
        .status(400)
        .json({ error: "Input rejected. Please ask weather-related questions." });
    }

    if (tag === "historian") {
      return handleHistorianAgent(input, previousResponseId, res);
    } else {
      return handleDefaultAgent(input, previousResponseId, weatherData, res);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
