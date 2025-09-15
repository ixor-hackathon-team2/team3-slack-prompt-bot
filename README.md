# Slack LangGraph Bot

This bot depends on a Slack Bot to exist and `SLACK_BOT_TOKEN` to be present in the .env file.
It uses the Slack Bot to interact with users the Slack App channel.
It forwards the user's request to a LangGraph deployment and returns the first answer of the list.

The bot is <b>STATELESS</b> meaning no "conversations" can be had in Slack with the bot (yet).

## Guide

1. Create a `.env` file with following variables: LANGCHAIN_API_KEY, LANGCHAIN_API_URL and SLACK_BOT_TOKEN
2. Install dependencies with `npm install`
3. Running the script locally can be done with `npm run dev` which uses nodemon to automatically watch files and restart the server when changes are done.
4. Building is done with `npm run build` which uses tsc to output a ./dist folder
5. `npm run start` uses the built ./dist files to run the script
