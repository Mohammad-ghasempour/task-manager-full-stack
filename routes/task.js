import express from "express";
import TaskController from "../controllers/task.js";
import Task from "../models/task.js";

const route = express.Router();

route.get("/tasks", TaskController.getAllTasks);
route.get("/task/:id", TaskController.getTaskById);
route.post("/tasks", TaskController.addTask);
route.put("/tasks/:id", TaskController.updateTask);
route.delete("/tasks/:id", TaskController.deleteTask);

export default route;
