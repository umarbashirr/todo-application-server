import { prisma } from "../config/db.js";
import { tasksSchema } from "../schemas/tasks.schema.js";

export const createTask = async (req, res) => {
  try {
    const fields = tasksSchema.safeParse(req.body);

    if (!fields.success) {
      return res.status(400).json({
        message: fields.error.flatten().fieldErrors,
        success: false,
      });
    }

    const { title, description } = fields.data;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        createdBy: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    res.status(201).json({
      message: "Task created successfully!",
      success: true,
      data: { ...task },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        createdById: req.user.id,
        isDeleted: false,
      },
    });

    res.status(200).json({
      message: "Tasks fetched successfully!",
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const updateTask = async (req, res) => {
  try {
    const fields = tasksSchema.safeParse(req.body);
    const { taskId } = req.params;

    if (!fields.success) {
      return res.status(400).json({
        message: fields.error.flatten().fieldErrors,
        success: false,
      });
    }

    const { title, description } = fields.data;

    const task = await prisma.task.update({
      where: {
        id: taskId,
        createdById: req.user.id,
        isDeleted: false,
      },
      data: {
        title,
        description,
      },
    });

    res.status(200).json({
      message: "Task updated successfully!",
      success: true,
      data: { ...task },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const updateCompletionState = async (req, res) => {
  try {
    const { taskId } = req.params;

    const { isCompleted } = req.body;

    const task = await prisma.task.update({
      where: {
        id: taskId,
        createdById: req.user.id,
        isDeleted: false,
      },
      data: {
        isCompleted,
      },
    });

    res.status(200).json({
      message: "Task updated successfully!",
      success: true,
      data: { ...task },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const deleteTaskFromList = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await prisma.task.update({
      where: {
        id: taskId,
        createdById: req.user.id,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
      },
    });

    res.status(200).json({
      message: "Task deleted successfully!",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const recoverFromTrash = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await prisma.task.update({
      where: {
        id: taskId,
        createdById: req.user.id,
        isDeleted: true,
      },
      data: {
        isDeleted: false,
      },
    });

    res.status(200).json({
      message: "Task restored successfully!",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
