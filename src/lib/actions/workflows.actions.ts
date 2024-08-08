"use server";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";

export const getGoogleListener = async () => {
  const { userId } = auth();

  if (!userId) {
    throw Error("User not found");
  }

  const listener = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      googleResourceId: true,
    },
  });

  return listener || {};
};

export const onWorkflowPublish = async (workflowId: string, state: boolean) => {
  const published = await db.workflows.update({
    where: {
      id: workflowId,
    },
    data: {
      publish: state,
    },
  });

  return {
    message: published.publish ? "Workflow published" : "Workflow unpublished",
  };
};

export const onCreateNodeTemplate = async (
  content: string,
  type: string,
  workflowId: string,
  channels?: any[],
  accessToken?: string,
  notionDbId?: string
) => {
  if (type === "Discord") {
    const response = await db.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        discordTemplate: content,
      },
    });

    if (!response) {
      throw Error("Error saving discord template");
    }

    return { message: "Discord template saved" };
  }

  if (type === "Slack") {
    const response = await db.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        slackTemplate: content,
        slackAccessToken: accessToken,
      },
    });

    if (!response) {
      throw Error("Error saving slack template");
    }

    const channelList = await db.workflows.findUnique({
      where: {
        id: workflowId,
      },
      select: {
        slackChannels: true,
      },
    });

    if (channelList) {
      //remove duplicates before insert
      const NonDuplicated = channelList.slackChannels.filter(
        (channel) => channel !== channels![0].value
      );

      NonDuplicated!
        .map((channel) => channel)
        .forEach(async (channel) => {
          await db.workflows.update({
            where: {
              id: workflowId,
            },
            data: {
              slackChannels: {
                push: channel,
              },
            },
          });
        });

      return { message: "Slack template saved" };
    }

    channels!
      .map((channel) => channel.value)
      .forEach(async (channel) => {
        await db.workflows.update({
          where: {
            id: workflowId,
          },
          data: {
            slackChannels: {
              push: channel,
            },
          },
        });
      });
    return { message: "Slack template saved" };
  }

  if (type === "Notion") {
    const response = await db.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        notionTemplate: content,
        notionAccessToken: accessToken,
        notionDbId: notionDbId,
      },
    });

    if (!response) {
      throw Error("Error saving notion template");
    }

    return { message: "Notion template saved" };
  }
};

export const onGetWorkflows = async () => {
  const user = await currentUser();

  if (!user) {
    throw Error("User not found");
  }

  const workflow = await db.workflows.findMany({
    where: {
      userId: user.id,
    },
  });

  if (workflow) return workflow;
};

export const onCreateWorkflow = async (name: string, description: string) => {
  const user = await currentUser();

  if (!user) {
    throw Error("User not found");
  }

  //create new workflow
  const workflow = await db.workflows.create({
    data: {
      userId: user.id,
      name,
      description,
    },
  });

  return { message: workflow ? "Workflow created" : "Oops! try again" };
};

export const onGetNodesEdges = async (flowId: string) => {
  const nodesEdges = await db.workflows.findUnique({
    where: {
      id: flowId,
    },
    select: {
      nodes: true,
      edges: true,
    },
  });

  return nodesEdges || {};
};
