"use server";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import axios, { AxiosError } from "axios";
import { clerkClient as clerk } from "@clerk/clerk-sdk-node";
import { google } from "googleapis";
import { Client } from "@notionhq/client";
import { Option } from "@/components/ui/multiple-select";

export const onDiscordConnect = async (
  channel_id: string,
  webhook_id: string,
  webhook_name: string,
  webhook_url: string,
  id: string,
  guild_name: string,
  guild_id: string
) => {
  //check if webhook id params set
  if (webhook_id) {
    //check if webhook exists in database with userid
    const webhook = await db.discordWebhook.findFirst({
      where: {
        userId: id,
      },
      include: {
        connections: {
          select: {
            type: true,
          },
        },
      },
    });

    //if webhook does not exist for this user
    if (!webhook) {
      //create new webhook
      await db.discordWebhook.create({
        data: {
          userId: id,
          webhookId: webhook_id,
          channelId: channel_id!,
          guildId: guild_id!,
          name: webhook_name!,
          url: webhook_url!,
          guildName: guild_name!,
          connections: {
            create: {
              userId: id,
              type: "Discord",
            },
          },
        },
      });
    }

    //if webhook exists return check for duplicate
    if (webhook) {
      //check if webhook exists for target channel id
      const webhook_channel = await db.discordWebhook.findUnique({
        where: {
          channelId: channel_id,
        },
        include: {
          connections: {
            select: {
              type: true,
            },
          },
        },
      });

      //if no webhook for channel create new webhook
      if (!webhook_channel) {
        await db.discordWebhook.create({
          data: {
            userId: id,
            webhookId: webhook_id,
            channelId: channel_id!,
            guildId: guild_id!,
            name: webhook_name!,
            url: webhook_url!,
            guildName: guild_name!,
            connections: {
              create: {
                userId: id,
                type: "Discord",
              },
            },
          },
        });
      }
    }
  }
};

export const getDiscordConnectionUrl = async () => {
  const user = await currentUser();

  if (!user) {
    throw Error("User not found");
  }

  const webhook = await db.discordWebhook.findFirst({
    where: {
      userId: user.id,
    },
    select: {
      url: true,
      name: true,
      guildName: true,
    },
  });

  return webhook;
};

export const postContentToWebHook = async (content: string, url: string) => {
  if (!content) {
    throw Error("Content is empty");
  }

  const posted = await axios.post(url, { content });

  if (!posted) {
    throw Error("Failed to post content to webhook");
  }

  return {
    message: "success",
  };
};

export const getFileMetaData = async () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.OAUTH2_REDIRECT_URI
  );

  const { userId } = auth();

  if (!userId) {
    throw Error("User not found");
  }

  const clerkResponse = await clerk.users.getUserOauthAccessToken(
    userId,
    "oauth_google"
  );

  const accessToken = clerkResponse.data[0].token;

  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  const drive = google.drive({ version: "v3", auth: oauth2Client });
  const response = await drive.files.list();

  if (!response) return;

  return response.data;
};

export const onNotionConnect = async (
  access_token: string,
  workspace_id: string,
  workspace_icon: string,
  workspace_name: string,
  database_id: string,
  id: string
) => {
  if (!access_token) return;

  //check if notion is connected
  const notion_connected = await db.notion.findFirst({
    where: {
      accessToken: access_token,
    },
    include: {
      connections: {
        select: {
          type: true,
        },
      },
    },
  });

  if (notion_connected) return;

  //create connection
  await db.notion.create({
    data: {
      userId: id,
      workspaceIcon: workspace_icon!,
      accessToken: access_token,
      workspaceId: workspace_id!,
      workspaceName: workspace_name!,
      databaseId: database_id,
      connections: {
        create: {
          userId: id,
          type: "Notion",
        },
      },
    },
  });
};
export const getNotionConnection = async () => {
  const user = await currentUser();

  if (!user) {
    throw Error("User not found");
  }

  const connection = await db.notion.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!connection) return;

  return connection;
};

export const getNotionDatabase = async (
  databaseId: string,
  accessToken: string
) => {
  const notion = new Client({
    auth: accessToken,
  });
  const response = await notion.databases.retrieve({ database_id: databaseId });
  return response;
};

export const onCreateNewPageInDatabase = async (
  databaseId: string,
  accessToken: string,
  content: string | { name: string; [x: string]: string }
) => {
  const notion = new Client({
    auth: accessToken,
  });

  console.log({ content });
  const response = await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: databaseId,
    },
    properties: {
      name: [
        {
          text: {
            content: typeof content === "string" ? content : content?.name,
          },
        },
      ],
    },
  });

  if (!response) return;

  return response;
};

export const onSlackConnect = async (
  app_id: string,
  authed_user_id: string,
  authed_user_token: string,
  slack_access_token: string,
  bot_user_id: string,
  team_id: string,
  team_name: string,
  user_id: string
): Promise<void> => {
  if (!slack_access_token) return;

  const slackConnection = await db.slack.findFirst({
    where: { slackAccessToken: slack_access_token },
    include: { connections: true },
  });

  if (slackConnection) return;

  await db.slack.create({
    data: {
      userId: user_id,
      appId: app_id,
      authedUserId: authed_user_id,
      authedUserToken: authed_user_token,
      slackAccessToken: slack_access_token,
      botUserId: bot_user_id,
      teamId: team_id,
      teamName: team_name,
      connections: {
        create: { userId: user_id, type: "Slack" },
      },
    },
  });
};

export const getSlackConnection = async () => {
  const user = await currentUser();

  if (!user) {
    throw Error("User not found");
  }

  return await db.slack.findFirst({
    where: { userId: user.id },
  });
};

export async function listBotChannels(
  slackAccessToken: string
): Promise<Option[]> {
  const url = `https://slack.com/api/conversations.list?${new URLSearchParams({
    types: "public_channel,private_channel",
    limit: "200",
  })}`;

  try {
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${slackAccessToken}` },
    });

    if (!data.ok) throw new Error(data.error);

    if (!data?.channels?.length) return [];

    return data.channels
      .filter((ch: any) => ch.is_member)
      .map((ch: any) => {
        return { label: ch.name, value: ch.id };
      });
  } catch (error) {
    if (error instanceof AxiosError || error instanceof Error) {
      console.error("Error listing bot channels:", error.message);
    }
    throw error;
  }
}

const postMessageInSlackChannel = async (
  slackAccessToken: string,
  slackChannel: string,
  content: string
): Promise<void> => {
  try {
    await axios.post(
      "https://slack.com/api/chat.postMessage",
      { channel: slackChannel, text: content },
      {
        headers: {
          Authorization: `Bearer ${slackAccessToken}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    console.log(`Message posted successfully to channel ID: ${slackChannel}`);
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      console.error(
        `Error posting message to Slack channel ${slackChannel}:`,
        error?.response?.data || error.message
      );
    }
    throw error;
  }
};

// Wrapper function to post messages to multiple Slack channels
export const postMessageToSlack = async (
  slackAccessToken: string,
  selectedSlackChannels: Option[],
  content: string
): Promise<{ message: string }> => {
  if (!content) return { message: "Content is empty" };

  if (!selectedSlackChannels?.length)
    return { message: "Channel not selected" };

  try {
    selectedSlackChannels
      .map((channel) => channel?.value)
      .forEach((channel) => {
        postMessageInSlackChannel(slackAccessToken, channel, content);
      });
    return { message: "Success" };
  } catch (error) {
    return { message: "Message could not be sent to Slack" };
  }
};
