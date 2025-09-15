"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const handleSlackPrompt_1 = require("../controllers/handleSlackPrompt");
const router = (0, express_1.Router)();
// POST /challenge
router.post("/", handleSlackPrompt_1.handleSlackPrompt);
exports.default = router;
