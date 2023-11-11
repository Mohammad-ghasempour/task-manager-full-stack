import Task from "../models/task.js";
import DB from "../models/db.js";



export default class PostController{
    static insertData(req, res){
        if (req.body.title) {
           const title = req.body.title;
           const completed = req.body.completed ? true : false;
           try {
              const task = new Task(title, completed);
              task.save();
              res.redirect("/");
           } catch (err) {
              res.status(400).send(`<hr>${err.message}<h1/>`);
           }
        } else {
           res.status(400).send(
              "<h1>Invalid request. You should send something!</h1>"
           );
        }
     }
     static toggleTask(req, res){
        if (req.body.id) {
           const task = Task.getTaskById(req.body.id);
           if (task) {
              task.completed = !task.completed;
              task.save();
              res.json(true);
           } else {
              res.status(404).send("<h1>Task not found!</h1>");
           }
        } else {
           res.status(400).send("<h1>Invalid request!</h1>");
        }
     }
     static editTask(req, res){
        if (req.body.id && req.body.title) {
           const task = Task.getTaskById(req.body.id);
           if (task) {
              try {
                 task.title = req.body.title;
                 task.save();
                 res.json(true);
              } catch (err) {
                 res.status(400).send(err.message);
              }
           } else {
              res.status(404).send("<h1>Task not found!</h1>");
           }
        } else {
           res.status(400).send(
              "<h1>Invalid request! the request should have both Id and Title</h1>"
           );
        }
     }
     static deleteTask(req, res){
        if (req.body.id) {
           try {
              if (DB.deleteTask(req.body.id)){
                 res.json(true);
              }else{
                 res.status(404).send('Task not fount!')
              }
           } catch (err) {
              res.status(500).send("Server error!" , err.message);
           }
        } else {
           res.status(400).send("<h1>Invalid request!</h1>");
        }
     }


}