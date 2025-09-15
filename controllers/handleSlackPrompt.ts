import { Client } from "@langchain/langgraph-sdk";
import axios from "axios";
import { Request, Response } from "express";
import { filterAndBuildObjects } from "../services/dataService";

export const handleSlackPrompt = async (req: Request, res: Response) => {
  try {
    const { event, type, challenge } = req.body as any;

    // Slack URL verification handshake
    if (type === "url_verification" && challenge) {
      return res.status(200).send(challenge);
    }

    // Ignore Slack retry deliveries to avoid duplicates
    const retryNum = req.headers["x-slack-retry-num"] as string | undefined;
    if (retryNum) {
      res.setHeader("X-Slack-No-Retry", "1");
      return res.status(200).end();
    }

    if (!event) {
      return res.status(400).json({ error: "Missing data: event" });
    }

    // Prevent bot loops: ignore events from bots or our own bot user
    if (
      event.subtype === "bot_message" ||
      event.bot_id ||
      (process.env.SLACK_BOT_USER_ID &&
        event.user === process.env.SLACK_BOT_USER_ID)
    ) {
      return res.status(200).end();
    }

    const { channel, prompt } = filterAndBuildObjects(event);

    type RunState = { messages: { role: string; content: string }[] };
    const client = new Client<RunState>({
      apiUrl: process.env.LANGCHAIN_API_URL,
    });
    const assistantId = "agent";
    const thread = await client.threads.create();

    let input = {
      messages: [{ role: "user", content: prompt }],
    };

    const runResponse = (await client.runs.wait(thread.thread_id, assistantId, {
      input,
    })) as RunState;

    console.log(runResponse);

    await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel,
        text: runResponse.messages[-1].content,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e: any) {
    throw new Error(e);
  }
};
