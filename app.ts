const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

import { Router } from "express";
import promptRouter from "./routes/prompt";

dotenv.config();

const app = express();
const router = Router();
const port = 3000;

app.use(bodyParser.json());

app.use("/", promptRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
