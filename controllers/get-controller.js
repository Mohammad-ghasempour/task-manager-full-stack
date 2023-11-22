import Task from "../models/task.js";
import path from "path";
import { rootPath } from "../app.js";

export default class GetController {

   static homeController(req, res) {
    res.sendFile(rootPath + "/view/home.html")
   }

   static getAllTasks(req,res){
      try {
         const tasks = Task.getAllTasks(true);
         res.json(tasks)
      } catch (err) {
         res.status(500).send('Internal Server Error!',err.message)
      }
   }
}
