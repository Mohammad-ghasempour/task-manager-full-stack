import express from "express";

import Task from "./task.js";

const route = express.Router();

route.get("/", (req, res) => {
   const tasks = Task.getAllTasks();
   res.send(`<!DOCTYPE html>
    <html lang="en">
       <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="css/style.css">
          <title>Task manager</title>
       </head>
       <body>
          <div class="container">
          <div class="inputForm">
            <h1>Task manager (To-Do list)</h1>
            <form action="insertData" method="post">
            <div>
            <input type="text" name="title" placeholder="Enter a new title">
            <button type="submit">Add new task</button>
         </div>
         <div>
            <input type="checkbox"
            name="completed"
            id="my-checkbox"
            />
            <label for="my-checkbox">The task is completed.</label>
         </div>
            </form>
         </div>
             <div class="taskslist">
                <h1 class="taskHeader"> Tasks </h1>
                <div class="contentContainer">
                   <ul class="list-group">
                   ${tasks
                      .map((item) => {
                         return `  <li data-taskId=${item.id}>
                    <span>
                        <label>${item.title}</label>
                        <span class="status ${
                           item.completed ? "bg-success" : "bg-secondary"
                        }">${
                            item.completed ? "Completed" : "In progress"
                         }</span>
                    </span>
                    <button class="btn-secondary toggle-btn">Toggle</button>
                    <button class="btn-primary edit-btn">Edit</button>
                    <button class="btn-danger delete-btn">Delete</button>
                </li>`;
                      })
                      .join("")}
                                    
                   </ul>
                </div>
             </div>
          </div>
       </body>
       <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
       <script src="js/script.js"></script>
    </html>
    
    `);
});

export default route;
