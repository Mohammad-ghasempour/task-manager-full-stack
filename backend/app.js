import path from "path";
import { fileURLToPath } from "url";

import "dotenv/config";
import express from "express";

import getRoute from "./routes/get-routes.js";
import postRoute from "./routes/post-routes.js";
import taskRoutes from "./routes/task.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "view"));

app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Headers", "*");
   res.setHeader("Access-Control-Allow-Methods", "*");
   next();
});

app.use(taskRoutes);
//app.use(getRoute);
//app.use(postRoute);
app.listen(3000);

export { __dirname as rootPath };
