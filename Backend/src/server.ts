import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import weatherRoutes from "./routes/weather.routes";
import forecastRoutes from "./routes/forecast.routes";
import chatroutes from "./routes/chat.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/weather", weatherRoutes);
app.use("/api/forecast", forecastRoutes);
app.use("/api/chat", chatroutes);


// app.get("/", (_, res) => {
//   res.json({ message: "Smart Weather API running" });
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
