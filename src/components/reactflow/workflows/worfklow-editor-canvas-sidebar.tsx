"use client";
import { EditorCanvasTypes, EditorNodeType } from "@/lib/types";
import { useNodeConnections } from "@/providers/connections-provider";
import { useEditor } from "@/providers/editor-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { CONNECTIONS, EditorCanvasDefaultCardTypes } from "@/lib/constants";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchBotSlackChannels, onConnections, onDragStart } from "@/lib/utils";
import EditorCanvasIconHelper from "@/components/icons/wofklows-editor-canvas-icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useFuzzieStore } from "@/lib/store";
import RenderConnectionAccordion from "@/components/accordions/connection-accordion";
import RenderOutputAccordion from "@/components/accordions/output-accordion";
import clsx from "clsx";

type Props = {
  nodes: EditorNodeType[];
};

const EditorCanvasSidebar = ({ nodes }: Props) => {
  const { state } = useEditor();
  const { nodeConnection } = useNodeConnections();
  const [activeTab, setActiveTab] = React.useState("actions");

  const { googleFile, setSlackChannels } = useFuzzieStore();

  useEffect(() => {
    if (state) {
      onConnections(nodeConnection, state, googleFile);
    }
  }, [state]);

  useEffect(() => {
    if (nodeConnection.slackNode.slackAccessToken) {
      fetchBotSlackChannels(
        nodeConnection.slackNode.slackAccessToken,
        setSlackChannels
      );
    }
  }, [nodeConnection]);

  return (
    <aside>
      <Tabs defaultValue="actions" className="h-screen overflow-scroll pb-24">
        <TabsList className="bg-transparent relative w-full flex items-center justify-start">
          <TabsTrigger value="actions" onClick={() => setActiveTab("actions")}>
            Actions
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </TabsTrigger>
          <div
            className={clsx({
              "absolute rounded-xl bottom-0 border-b border-b-purple-600 left-0 h-3 transition-all duration-500 ease-in-out":
                true,
              "w-[54px] left-3.5 h-2": activeTab === "actions",
              "h-2 w-[60px] left-[88px]": activeTab === "settings",
            })}
          />
        </TabsList>
        <Separator />
        <TabsContent value="actions" className="flex flex-col gap-4 p-4">
          {Object.entries(EditorCanvasDefaultCardTypes)
            .filter(
              ([_, cardType]) =>
                (!nodes.length && cardType.type === "Trigger") ||
                (nodes.length && cardType.type === "Action")
            )
            .map(([cardKey, cardValue]) => (
              <Card
                key={cardKey}
                draggable
                className="w-full cursor-grab border-black bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900"
                onDragStart={(event) =>
                  onDragStart(event, cardKey as EditorCanvasTypes)
                }
              >
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <EditorCanvasIconHelper type={cardKey as EditorCanvasTypes} />
                  <CardTitle className="text-md">
                    {cardKey}
                    <CardDescription>{cardValue.description}</CardDescription>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
        </TabsContent>
        <TabsContent value="settings" className="-mt-6 h-full">
          {state.editor.selectedNode.data.title ? (
            <>
              <div className="px-2 py-4 text-center text-xl font-bold">
                {state.editor.selectedNode.data.title}
              </div>

              <Accordion type="multiple" aria-expanded>
                <AccordionItem value="Options" className="border-y-[1px] px-2">
                  <AccordionTrigger className="!no-underline">
                    Account
                  </AccordionTrigger>
                  <AccordionContent>
                    {CONNECTIONS.map((connection) => (
                      <RenderConnectionAccordion
                        key={connection.title}
                        state={state}
                        connection={connection}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="Expected Output" className="px-2">
                  <AccordionTrigger className="!no-underline">
                    Action
                  </AccordionTrigger>
                  <RenderOutputAccordion
                    state={state}
                    nodeConnection={nodeConnection}
                  />
                </AccordionItem>
              </Accordion>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p>Select a node to do an action.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </aside>
  );
};

export default EditorCanvasSidebar;
