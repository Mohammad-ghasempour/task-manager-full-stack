import express, { urlencoded } from "express";

import PostController from "../controllers/post-controller.js";

const route = express.Router();

route.post("/addData", PostController.addData);

route.post("/toggle-task", PostController.toggleTask);

route.post("/edit-task", PostController.editTask);

route.post("/delete-task", PostController.deleteTask);

export default route;
