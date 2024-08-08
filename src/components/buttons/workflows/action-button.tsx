import React, { useCallback } from "react";
import { ConnectionProviderProps } from "@/providers/connections-provider";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Option } from "@/components/ui/multiple-select";
import { useToast } from "@/components/ui/use-toast";
import {
  onCreateNewPageInDatabase,
  postContentToWebHook,
  postMessageToSlack,
} from "@/lib/actions/connections.actions";
import { onCreateNodeTemplate } from "@/lib/actions/workflows.actions";

type Props = {
  currentService: string;
  nodeConnection: ConnectionProviderProps;
  channels?: Option[];
  setChannels?: (value: Option[]) => void;
};

const ActionButton = ({
  currentService,
  nodeConnection,
  channels,
  setChannels,
}: Props) => {
  const { toast } = useToast();
  const pathname = usePathname();

  const onSendDiscordMessage = useCallback(async () => {
    try {
      const response = await postContentToWebHook(
        nodeConnection.discordNode.content,
        nodeConnection.discordNode.webhookURL
      );

      if (response.message == "success") {
        nodeConnection.setDiscordNode((prev: any) => ({
          ...prev,
          content: "",
        }));
      }
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }, [nodeConnection.discordNode]);

  const onStoreNotionContent = useCallback(async () => {
    try {
      const response = await onCreateNewPageInDatabase(
        nodeConnection.notionNode.databaseId,
        nodeConnection.notionNode.accessToken,
        nodeConnection.notionNode.content
      );
      if (response) {
        nodeConnection.setNotionNode((prev: any) => ({
          ...prev,
          content: "",
        }));

        toast({
          title: "Success",
          description: "Message sent successfully",
          variant: "success",
        });
      }
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }, [nodeConnection.notionNode]);

  const onStoreSlackContent = useCallback(async () => {
    try {
      const response = await postMessageToSlack(
        nodeConnection.slackNode.slackAccessToken,
        channels!,
        nodeConnection.slackNode.content
      );
      debugger;
      if (response.message == "Success") {
        toast({
          title: "Success",
          description: "Message sent successfully",
          variant: "success",
        });
        nodeConnection.setSlackNode((prev: any) => ({
          ...prev,
          content: "",
        }));
        setChannels!([]);
      } else {
        toast({
          title: "Missing Parameters",
          description: "Channel not selected or content is empty",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }, [nodeConnection.slackNode, channels]);

  const onCreateLocalNodeTempate = useCallback(async () => {
    try {
      if (currentService === "Discord") {
        const response = await onCreateNodeTemplate(
          nodeConnection.discordNode.content,
          currentService,
          pathname.split("/").pop()!
        );

        if (!response) return;

        toast({
          title: "Success",
          description: response.message,
          variant: "success",
        });
      }
      if (currentService === "Slack") {
        const response = await onCreateNodeTemplate(
          nodeConnection.slackNode.content,
          currentService,
          pathname.split("/").pop()!,
          channels,
          nodeConnection.slackNode.slackAccessToken
        );

        if (!response) return;

        toast({
          title: "Success",
          description: response.message,
          variant: "success",
        });
      }

      if (currentService === "Notion") {
        const response = await onCreateNodeTemplate(
          JSON.stringify(nodeConnection.notionNode.content),
          currentService,
          pathname.split("/").pop()!,
          [],
          nodeConnection.notionNode.accessToken,
          nodeConnection.notionNode.databaseId
        );

        if (!response) return;

        toast({
          title: "Success",
          description: response.message,
          variant: "success",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }, [nodeConnection, channels]);

  const renderActionButton = () => {
    switch (currentService) {
      case "Discord":
        return (
          <>
            <Button variant="outline" onClick={onSendDiscordMessage}>
              Test Message
            </Button>
            <Button onClick={onCreateLocalNodeTempate} variant="outline">
              Save Template
            </Button>
          </>
        );

      case "Notion":
        return (
          <>
            <Button variant="outline" onClick={onStoreNotionContent}>
              Test Message
            </Button>
            <Button onClick={onCreateLocalNodeTempate} variant="outline">
              Save Template
            </Button>
          </>
        );

      case "Slack":
        return (
          <>
            <Button variant="outline" onClick={onStoreSlackContent}>
              Send Message
            </Button>
            <Button onClick={onCreateLocalNodeTempate} variant="outline">
              Save Template
            </Button>
          </>
        );

      default:
        return null;
    }
  };
  return renderActionButton();
};

export default ActionButton;
