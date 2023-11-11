import express from "express";
import GetController from "../controllers/get-controller.js";

const route = express.Router();

route.get("/", GetController.homeController);

export default route;
