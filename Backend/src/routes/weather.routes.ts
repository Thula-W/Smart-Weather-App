import { Router} from "express";
import { getWeatherByCity, getWeatherByCoordinates, getWeatherByZip } from "../services/weather.service";

const router = Router();

router.get("/", getWeatherByCity);
router.get("/coordinates", getWeatherByCoordinates);
router.get("/zip",getWeatherByZip);

export default router;
