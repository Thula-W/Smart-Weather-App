import { Router} from "express";
import { handleWeatherChat } from "../services/llm.service";

const router = Router();

router.post("/", handleWeatherChat);


export default router;
