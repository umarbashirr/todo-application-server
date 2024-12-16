import { Router } from "express";
import { createTask, getAllTasks } from "../controllers/tasks.controller.js";
import { verifyToken } from "../middlewares/verify-token.js";

const router = Router();

router.use(verifyToken);

router.route("/").post(createTask).get(getAllTasks);

export default router;
