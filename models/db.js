   import fs from "fs";

   import chalk from "chalk";

   const filename = process.env.DB_FILE;
   const warn = chalk.yellowBright.bold;
   const success = chalk.greenBright.bold;

   export default class DB {
   static createDB() {
      if (fs.existsSync(filename)) {
         console.log(warn("The file is already exist!"));
         return false;
      }
      try {
         fs.writeFileSync(filename, "[]", "utf-8");
         console.log(success("DB file created successfully!"));
         return true;
      } catch (error) {
         throw new Error("Oops! Can't create the file: " + filename);
      }
   }

   static resetDB() {
      try {
         fs.writeFileSync(filename, "[]", "utf8");
         return true;
      } catch (error) {
         throw new Error("Oops! Can't create the file: " + filename);
      }
   }

   static DBExist() {
      if (fs.existsSync(filename)) {
         return true;
      } else {
         return false;
      }
   }

   static getTaskById(id) {
      let data;
      if (DB.DBExist()) {
         data = fs.readFileSync(filename, "utf-8");
      } else {
         try {
            DB.createDB();
            return false;
         } catch (e) {
            throw new Error(e.message);
         }
      }
      try {
         data = JSON.parse(data);
         const task = data.find((item) => item.id === Number(id));
         return task ? task : false;
      } catch (error) {
         throw new Error("Syntax error.\n please check the DB file");
      }
   }

   static getTaskByTitle(title) {
      let data;
      if (DB.DBExist()) {
         data = fs.readFileSync(filename, "utf-8");
      } else {
         try {
            DB.createDB();
            return false;
         } catch (e) {
            throw new Error(e.message);
         }
      }
      try {
         data = JSON.parse(data);
         const task = data.find((item) => item.title === title);
         return task ? task : false;
      } catch (error) {
         throw new Error("Syntax error.\n please check the DB file");
      }
   }

   static getAllTasks() {
      let data;
      if (DB.DBExist()) {
         data = fs.readFileSync(filename, "utf-8");
      } else {
         try {
            DB.createDB();
            return false;
         } catch (e) {
            throw new Error(e.message);
         }
      }
      try {
         data = JSON.parse(data);
         return data;
      } catch (error) {
         throw new Error("Syntax error.\n please check the DB file");
      }
   }

   static saveTask(title, completed = false, id = 0) {
      id = Number(id);
      if (id < 0 || id != parseInt(id)) {
         throw new Error("Id must be an integer, equal or greader than 0");
      } else if (typeof title !== "string" || title.length < 3) {
         throw new Error("title must contain at least 3 characters.");
      }

      const task = this.getTaskByTitle(title);
      if (task && task.id != id) {
         throw new Error("A task exist with this title.");
      }

      let data;
      if (DB.DBExist()) {
         data = fs.readFileSync(filename, "utf-8");
      } else {
         try {
            DB.createDB();
            data = "[]";
         } catch (error) {
            throw new Error(error.nessage);
         }
      }

      try {
         data = JSON.parse(data);
      } catch (e) {
         throw new Error("Syntax error. \n plese check the DB file.");
      }

      if (id === 0) {
         if (data.length === 0) {
            id = 1;
         } else {
            id = data[data.length - 1].id + 1;
         }
         data.push({
            id,
            title,
            completed,
         });
         const str = JSON.stringify(data, null, "    ");
         try {
            fs.writeFileSync(filename, str, "utf-8");
            return id;
         } catch (e) {
            throw new Error(e.message);
         }
      } else {
         for (let i = 0; i < data.length; i++) {
            if (data[i].id === id) {
               // change its content
               data[i].title = title;
               data[i].completed = completed;
               const str = JSON.stringify(data, null, "    ");
               // write in the fs file again
               try {
                  fs.writeFileSync(filename, str, "utf-8");
                  return id;
               } catch (e) {
                  throw new Error(e.message);
               }
            }
         }
         throw new Error("Task not found");
      }
   }

   static insertBulkData(data) {
      if (typeof data === "string") {
         try {
            data = JSON.parse(data);
         } catch (e) {
            throw new Error("Invalid data");
         }
      }

      if (data instanceof Array) {
         try {
            data = JSON.stringify(data, null, "    ");
         } catch (e) {
            throw new Error("Can not convert data!");
         }
      } else {
         throw new Error("Invalid data");
      }

      try {
         fs.writeFileSync(filename, data, "utf-8");
      } catch (e) {
         throw new Error("Can not write to DB file.");
      }
   }

   static deleteTask(id) {
      id = Number(id);
      if (id > 0 && parseInt(id) === id) {
         let data;
         try {
            data = fs.readFileSync(filename, "utf-8");
            data = JSON.parse(data);
         } catch (error) {
            throw new Error("Can not read the file!");
         }

         // check if the id is exit in the list
         for (let i = 0; i < data.length; i++) {
            if (data[i].id === id) {
               data.splice(i, 1);
               const str = JSON.stringify(data, null, "    ");
               try {
                  fs.writeFileSync(filename, str, "utf-8");
                  return true;
               } catch (error) {
                  throw new Error("Can not write into the file!");
               }
            }
         }
         throw new Error("Id can not be found!");
      } else {
         throw new Error("Id must be positive integer"); //
      }
   }
   }
