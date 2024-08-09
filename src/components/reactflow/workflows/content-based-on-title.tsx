import { AccordionContent } from "@/components/ui/accordion";
import { ConnectionProviderProps } from "@/providers/connections-provider";
import { nodeMapper } from "@/lib/types";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { onContentChange } from "@/lib/utils";
import axios from "axios";
import { EditorState } from "@/lib/reducers/workflows-editor";
import { Option } from "@/components/ui/multiple-select";
import { useToast } from "@/components/ui/use-toast";
import ActionButton from "@/components/buttons/workflows/action-button";
import GoogleDriveFiles from "./google-drive-files";
import GoogleFileDetails from "./google-file-details";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  nodeConnection: ConnectionProviderProps;
  newState: EditorState;
  file: any;
  setFile: (file: any) => void;
  selectedSlackChannels: Option[];
  setSelectedSlackChannels: (value: Option[]) => void;
};

const ContentBasedOnTitle = ({
  nodeConnection,
  newState,
  file,
  setFile,
  selectedSlackChannels,
  setSelectedSlackChannels,
}: Props) => {
  const { toast } = useToast();
  const [files, setFiles] = React.useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = React.useState<any[]>([]);
  const { selectedNode } = newState.editor;
  const title = selectedNode.data.title;

  useEffect(() => {
    const reqGoogle = async () => {
      try {
        const response: { data: { message: { files: any } } } = await axios.get(
          "/api/drive"
        );

        if (!response) {
          toast({
            title: "Error",
            description: "Something went wrong",
            variant: "destructive",
          });
          return;
        }

        setFiles(response.data.message.files);
      } catch (e) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
        return;
      }
    };
    reqGoogle();
  }, []);

  // @ts-ignore
  const nodeConnectionType = nodeConnection[nodeMapper[title]];
  if (!nodeConnectionType) return <p>Not connected</p>;

  const isConnected =
    title === "Google Drive"
      ? !nodeConnection.isLoading
      : !!nodeConnectionType[
          `${
            title === "Slack"
              ? "slackAccessToken"
              : title === "Discord"
              ? "webhookURL"
              : title === "Notion"
              ? "accessToken"
              : ""
          }`
        ];

  if (!isConnected) return <p>Not connected</p>;

  return (
    <AccordionContent>
      <Card>
        {title === "Discord" && (
          <CardHeader>
            <CardTitle>{nodeConnectionType.webhookName}</CardTitle>
            <CardDescription>{nodeConnectionType.guildName}</CardDescription>
          </CardHeader>
        )}
        <div className="flex flex-col gap-3 px-6 py-3 pb-20">
          <p>{title === "Notion" ? "Values to be stored" : "Message"}</p>

          <Input
            type="text"
            value={
              title === "Notion"
                ? nodeConnectionType?.content?.name
                : nodeConnectionType.content
            }
            onChange={(event) => onContentChange(nodeConnection, title, event)}
          />

          {title !== "Google Drive" && (
            <Card className="w-full">
              <CardContent className="px-2 py-3">
                <div className="flex flex-col gap-4">
                  {files?.length ? (
                    <>
                      <div className="mb-2 ml-1">
                        Select the goodle drive files to send notification and
                        messages
                      </div>
                      <Select
                        onValueChange={(fileName) => {
                          const selectedFile = files.find(
                            (file) => file.name === fileName
                          );
                          if (selectedFile) {
                            setFile(selectedFile);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full focus:ring-0 focus:ring-offest-0 ">
                          <SelectValue placeholder="Select google drive file" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(files)).map((file) => (
                            <SelectItem
                              key={file.id}
                              value={file.name}
                              className="line-clamp-1"
                            >
                              {file.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  ) : (
                    "No Google drive files found. Please add your Slack bot to your Slack channel"
                  )}

                  {JSON.stringify(file) !== "{}" && (
                    <div className="flex flex-col gap-4">
                      <CardDescription>Drive File</CardDescription>

                      <div className="flex flex-col gap-2 w-full">
                        <GoogleFileDetails
                          nodeConnection={nodeConnection}
                          title={title}
                          gFile={file}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          {title === "Google Drive" && <GoogleDriveFiles />}
          <ActionButton
            currentService={title}
            nodeConnection={nodeConnection}
            channels={selectedSlackChannels}
            setChannels={setSelectedSlackChannels}
          />
        </div>
      </Card>
    </AccordionContent>
  );
};

export default ContentBasedOnTitle;
