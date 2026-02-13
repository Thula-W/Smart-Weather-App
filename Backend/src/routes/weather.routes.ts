import { Router, Request, Response } from "express";
import { getWeatherByCity } from "../services/weather.service";

const router = Router();

router.get("/", getWeatherByCity);

export default router;
