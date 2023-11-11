import path from "path";
import { fileURLToPath } from "url";

import "dotenv/config";
import express from "express";

import getRoute from "./routes/get-routes.js";
import postRoute from "./routes/post-routes.js"

const app = express();


const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(getRoute);
app.use(postRoute);
app.listen(3000);


export {__dirname as rootPath};