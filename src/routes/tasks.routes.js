import { Router } from "express";
import {
  createTask,
  deleteTaskFromList,
  getAllTasks,
  recoverFromTrash,
  updateCompletionState,
  updateTask,
} from "../controllers/tasks.controller.js";
import { verifyToken } from "../middlewares/verify-token.js";

const router = Router();

router.use(verifyToken);

router.route("/").post(createTask).get(getAllTasks);
router.route("/:taskId").put(updateTask).delete(deleteTaskFromList);
router.route("/change-status/:taskId").patch(updateCompletionState);
router.route("/recover/:taskId").patch(recoverFromTrash);

export default router;
