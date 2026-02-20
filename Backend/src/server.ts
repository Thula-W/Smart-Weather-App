import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import weatherRoutes from "./routes/weather.routes";
import chatroutes from "./routes/chat.routes";

import { chatLimiter, weatherLimiter } from "./utils/rate.limiters";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/weather",weatherLimiter, weatherRoutes);
app.use("/api/chat",chatLimiter,chatroutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
