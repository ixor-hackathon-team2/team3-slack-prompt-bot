"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const express_1 = require("express");
const prompt_1 = __importDefault(require("./routes/prompt"));
dotenv.config();
const app = express();
const router = (0, express_1.Router)();
const port = 3000;
app.use(bodyParser.json());
app.use("/", prompt_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
