import dotenv from "dotenv";
import { getHistoryWeatherTool } from "../services/weather.service"; 

dotenv.config();

const runTests = async () => {
    console.log("🚀 Starting History Tool Tests...\n");

    // Case 1: Valid Date
    try {
        console.log("Test 1: Valid Request (Gampaha, 2024-05-20)");
        const result = await getHistoryWeatherTool("Gampaha", "2024-05-20");
        console.table(result);
    } catch (error: any) {
        console.error("❌ Test 1 Failed:", error.message);
    }

    console.log("\n-----------------------------------\n");

    // Case 2: Invalid Date (Before 1979)
    try {
        console.log("Test 2: Date before 1979 (1970-01-01)");
        await getHistoryWeatherTool("Colombo", "1970-01-01");
    } catch (error: any) {
        console.log("✅ Test 2 Passed (Caught Expected Error):", error.message);
    }

    console.log("\n-----------------------------------\n");

    // Case 3: Malformed Date
    try {
        console.log("Test 3: Malformed Date string");
        await getHistoryWeatherTool("Kandy", "not-a-date");
    } catch (error: any) {
        console.log("✅ Test 3 Passed (Caught Expected Error):", error.message);
    }
};

runTests();