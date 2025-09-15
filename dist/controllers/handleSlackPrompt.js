"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSlackPrompt = void 0;
const langgraph_sdk_1 = require("@langchain/langgraph-sdk");
const axios_1 = __importDefault(require("axios"));
const dataService_1 = require("../services/dataService");
const handleSlackPrompt = async (req, res) => {
    try {
        const { event, type, challenge } = req.body;
        // Slack URL verification handshake
        if (type === "url_verification" && challenge) {
            return res.status(200).send(challenge);
        }
        // Ignore Slack retry deliveries to avoid duplicates
        const retryNum = req.headers["x-slack-retry-num"];
        if (retryNum) {
            res.setHeader("X-Slack-No-Retry", "1");
            return res.status(200).end();
        }
        if (!event) {
            return res.status(400).json({ error: "Missing data: event" });
        }
        // Prevent bot loops: ignore events from bots or our own bot user
        if (event.subtype === "bot_message" || event.bot_id || (process.env.SLACK_BOT_USER_ID && event.user === process.env.SLACK_BOT_USER_ID)) {
            return res.status(200).end();
        }
        const { channel, prompt } = (0, dataService_1.filterAndBuildObjects)(event);
        const client = new langgraph_sdk_1.Client({ apiUrl: process.env.LANGCHAIN_API_URL });
        const assistantId = "agent";
        const thread = await client.threads.create();
        let input = {
            messages: [{ role: "user", content: prompt }],
        };
        const runResponse = (await client.runs.wait(thread.thread_id, assistantId, {
            input,
        }));
        console.log(runResponse);
        await axios_1.default.post("https://slack.com/api/chat.postMessage", {
            channel,
            text: runResponse.messages[1].content,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
                "Content-Type": "application/json",
            },
        });
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.handleSlackPrompt = handleSlackPrompt;
