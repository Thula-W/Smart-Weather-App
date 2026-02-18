import { Router} from "express";
import { chatWithAssistant } from "../services/agent.service";

const router = Router();

router.post("/", chatWithAssistant);


export default router;
