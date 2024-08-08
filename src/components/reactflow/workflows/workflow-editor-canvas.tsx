"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  ReactFlowInstance,
  NodeChange,
  EdgeChange,
  Connection,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";

import { useEditor } from "@/providers/editor-provider";
import { usePathname } from "next/navigation";
import { EditorCanvasCardType, EditorNodeType } from "@/lib/types";
import EditorCanvasCardSingle from "@/components/cards/workflows/worfklow-editor-canvas-card";
import "@xyflow/react/dist/style.css";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useToast } from "@/components/ui/use-toast";
import { v4 } from "uuid";
import { EditorCanvasDefaultCardTypes } from "@/lib/constants";
import FlowInstance from "./flow-instance";
import Loader from "@/components/icons/loader";
import EditorCanvasSidebar from "./worfklow-editor-canvas-sidebar";

const initialNodes: EditorNodeType[] = [];

const initialEdges: { id: string; source: string; target: string }[] = [];

const WorfklowEditorCanvas = () => {
  const { toast } = useToast();
  const { dispatch, state } = useEditor();
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isWorkFlowLoading, setIsWorkFlowLoading] = useState<boolean>(false);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();
  const pathname = usePathname();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // @ts-ignore
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
        "application/reactflow"
      ) as EditorCanvasCardType["type"];

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const triggerAlreadyExists = state.editor.elements.find(
        (node) => node.type === "Trigger"
      );

      if (type === "Trigger" && triggerAlreadyExists) {
        toast({
          title: "Error",
          description:
            "Only one trigger can be added to automations at the moment",
          variant: "destructive",
        });
        return;
      }

      if (!reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: v4(),
        type,
        position,
        data: {
          title: type,
          description: EditorCanvasDefaultCardTypes[type].description,
          completed: false,
          current: false,
          metadata: {},
          type: type,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, state]
  );

  const handleClickCanvas = () => {
    dispatch({
      type: "SELECTED_ELEMENT",
      payload: {
        element: {
          data: {
            completed: false,
            current: false,
            description: "",
            metadata: {},
            title: "",
            type: "Trigger",
          },
          id: "",
          position: { x: 0, y: 0 },
          type: "Trigger",
        },
      },
    });
  };

  const onNodeDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
      dispatch({
        type: "DELETE_ELEMENT",
        payload: {
          nodeId,
        },
      });
    },
    [setNodes, setEdges]
  );

  useEffect(() => {
    dispatch({ type: "LOAD_DATA", payload: { edges, elements: nodes } });
  }, [nodes, edges]);

  const nodeTypes = useMemo(
    () => ({
      Action: ({ data }: any) => (
        <EditorCanvasCardSingle data={data} onNodeDelete={onNodeDelete} />
      ),
      Trigger: ({ data }: any) => (
        <EditorCanvasCardSingle data={data} onNodeDelete={onNodeDelete} />
      ),
      Email: ({ data }: any) => (
        <EditorCanvasCardSingle data={data} onNodeDelete={onNodeDelete} />
      ),
      Condition: ({ data }: any) => (
        <EditorCanvasCardSingle data={data} onNodeDelete={onNodeDelete} />
      ),
      AI: ({ data }: any) => (
        <EditorCanvasCardSingle data={data} onNodeDelete={onNodeDelete} />
      ),
      Slack: ({ data }: any) => (
        <EditorCanvasCardSingle data={data} onNodeDelete={onNodeDelete} />
      ),
      "Google Drive": ({ data }: any) => (
        <EditorCanvasCardSingle data={data} onNodeDelete={onNodeDelete} />
      ),
      Notion: ({ data }: any) => (
        <EditorCanvasCardSingle data={data} onNodeDelete={onNodeDelete} />
      ),
      Discord: ({ data }: any) => (
        <EditorCanvasCardSingle data={data} onNodeDelete={onNodeDelete} />
      ),
      "Google Calendar": ({ data }: any) => (
        <EditorCanvasCardSingle data={data} onNodeDelete={onNodeDelete} />
      ),
      "Custom Webhook": ({ data }: any) => (
        <EditorCanvasCardSingle data={data} onNodeDelete={onNodeDelete} />
      ),
      Wait: ({ data }: any) => (
        <EditorCanvasCardSingle data={data} onNodeDelete={onNodeDelete} />
      ),
    }),
    []
  );

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full items-center justify-center">
          <div
            style={{ width: "100%", height: "100%", paddingBottom: "70px" }}
            className="relative"
          >
            {isWorkFlowLoading ? (
              <div className="absolute flex h-full w-full items-center justify-center">
                <Loader />
              </div>
            ) : (
              <ReactFlow
                className="w-[300px]"
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodes={state.editor.elements}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                //@ts-ignore
                onInit={setReactFlowInstance}
                fitView
                onClick={handleClickCanvas}
                nodeTypes={nodeTypes}
              >
                <Controls position="top-left" />
                <MiniMap
                  position="bottom-left"
                  className="!bg-background"
                  zoomable
                  pannable
                />
                <Background
                  //@ts-ignore
                  variant="dots"
                  gap={12}
                  size={1}
                />
              </ReactFlow>
            )}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />

      <ResizablePanel defaultSize={40} className="relative sm:block">
        {isWorkFlowLoading ? (
          <div className="absolute flex h-full w-full items-center justify-center">
            <Loader />
          </div>
        ) : (
          <FlowInstance edges={edges} nodes={nodes}>
            <EditorCanvasSidebar nodes={nodes} />
          </FlowInstance>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default WorfklowEditorCanvas;
