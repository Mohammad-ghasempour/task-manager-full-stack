import Task from "../models/task.js";
import DB from "../models/db.js";

export default class TaskController {
   static getTasks(req, res) {
      let page = 1,
         limit = 4,
         finished = undefined,
         search = "";

      if (req.query.page > 0) {
         page = parseInt(req.query.page);
      }
      if (req.query.limit > 0) {
         limit = parseInt(req.query.limit);
      }
      if (req.query.search) {
         search = req.query.search;
      }
      if (req.query.finished == "true" || req.query.finished == "false") {
         finished = req.query.finished == "true" ? true : false;
      }

      try {
         let tasks = Task.getAllTasks(true);
         if (search) {
            tasks = tasks.filter((item) => item.title.includes(search));
         }
         if (finished !== undefined) {
            tasks = tasks.filter((item) => item.completed === finished);
         }
         const totalTasks = tasks.length;
         
         const start = (page - 1) * limit;
         tasks = tasks.slice(start, start + limit);

         res.json({
            success: true,
            body: tasks,
            message: "All tasks fetched",
            totalTasks,
         });
      } catch (err) {
         res.status(500).send({
            success: false,
            body: null,
            message: "Internal Server Error!",
         });
      }
   }

   static getTaskById(req, res) {
      const id = req.params.id;
      try {
         const task = Task.getTaskById(id);
         if (task) {
            console.log(task);
            res.json({
               success: true,
               body: task,
               message: "Task fetched",
            });
         } else {
            res.status(404).res({
               success: false,
               body: null,
               message: "Task not found!",
            });
         }
      } catch (err) {
         res.status(500).send({
            success: false,
            body: null,
            message: "Something wrong happend from server!",
         });
      }
   }

   static addTask(req, res) {
      if (req.body.title) {
         const title = req.body.title;
         const completed = req.body.completed ? true : false;

         if (title.length < 3) {
            return res.status(400).json({
               success: false,
               body: null,
               message: "Title must contain at least 3 character!",
            });
         } else if (Task.getTaskByTitle(title)) {
            return res.status(409).json({
               success: false,
               body: null,
               message: "A task already exist with this title!",
            });
         }

         try {
            const task = new Task(title, completed);
            task.save();
            res.status(201).json({
               success: true,
               body: task,
               message: "Task created successfully!",
            });
         } catch (err) {
            res.status(500).json({
               success: false,
               body: null,
               message: "Internal server error!",
            });
         }
      } else {
         res.status(400).json({
            success: false,
            body: null,
            message: "Invalid request. You should send something!",
         });
      }
   }

   static updateTask(req, res) {
      if (req.body.title && req.body.completed !== undefined) {
         const { title, completed } = req.body;

         if (title.length < 3) {
            return res.status(400).json({
               success: false,
               body: null,
               message: "Title must contain at least 3 character!",
            });
         }
         let task = Task.getTaskByTitle(title);
         if (task && task.id != req.params.id) {
            return res.status(409).json({
               success: false,
               body: null,
               message: "A task already exist with this title!",
            });
         }

         task = Task.getTaskById(req.params.id);
         if (task) {
            try {
               task.title = title;
               task.completed = completed;
               task.save();
               res.json({
                  success: true,
                  body: null,
                  message: "Task updated!",
               });
            } catch (err) {
               res.status(500).json({
                  success: false,
                  body: null,
                  message: "Internal server error!",
               });
            }
         } else {
            res.status(400).json({
               success: false,
               body: null,
               message: "Task not found!",
            });
         }
      } else {
         res.status(400).json({
            success: false,
            body: null,
            message: "Please provide both 'title' and 'completed'!",
         });
      }
   }

   static deleteTask(req, res) {
      try {
         if (DB.deleteTask(req.params.id)) {
            res.json({
               success: true,
               body: null,
               message: "Task deleted sucessfully!",
            });
         } else {
            res.status(404).json({
               success: false,
               body: null,
               message: "Task not found!",
            });
         }
      } catch (err) {
         res.status(500).json({
            success: false,
            body: null,
            message: err + " Internal server error!",
         });
      }
   }
}
