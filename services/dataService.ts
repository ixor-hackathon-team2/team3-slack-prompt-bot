interface SlackMessage {
  text: string;
  channel: string;
}

export const filterAndBuildObjects = (data: SlackMessage) => {
  console.log(data);
  return {
    prompt: data.text,
    channel: data.channel,
  };
};
