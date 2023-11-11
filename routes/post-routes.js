import express, { urlencoded } from "express";



import Task from "../models/task.js";
import DB from "../models/db.js";
import PostController from "../controllers/post-controller.js";

const route = express.Router();

route.post("/insertData", PostController.insertData );

route.post("/toggle-task", PostController.toggleTask);

route.post("/edit-task", PostController.editTask);

route.post("/delete-task", PostController.deleteTask);

export default route;
