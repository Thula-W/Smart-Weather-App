import { Router} from "express";
import { getForecastByCity, getForecastByCoordinates, getForecastByZip } from "../services/weather.service";

const router = Router();

router.get("/", getForecastByCity);
router.get("/coordinates", getForecastByCoordinates);
router.get("/zip",getForecastByZip);

export default router;
