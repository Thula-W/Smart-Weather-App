import { Router} from "express";
import { getWeather} from "../services/weather.service";

const router = Router();

router.get("/",getWeather)

export default router;
