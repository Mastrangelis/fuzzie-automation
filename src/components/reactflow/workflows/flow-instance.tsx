"use client";
import Loader from "@/components/icons/loader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  onCreateNodesEdges,
  onWorkflowPublish,
} from "@/lib/actions/workflows.actions";
import { useNodeConnections } from "@/providers/connections-provider";
import { Edge, Node } from "@xyflow/react";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  edges: Edge[];
  nodes: Node[];
};

const FlowInstance = ({ children, edges, nodes }: Props) => {
  const { toast } = useToast();
  const pathname = usePathname();
  const [isFlow, setIsFlow] = useState<string[]>([]);
  const { nodeConnection } = useNodeConnections();
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const [isPublishLoading, setIsPublishLoading] = useState<boolean>(false);

  const onFlowAutomation = useCallback(async () => {
    setIsSaveLoading(true);
    try {
      const flow = await onCreateNodesEdges(
        pathname.split("/").pop()!,
        JSON.stringify(nodes),
        JSON.stringify(edges),
        JSON.stringify(isFlow)
      );

      if (!flow) return;

      toast({
        title: "Success",
        description: flow.message,
        variant: "success",
      });
    } catch (e) {
      if (e instanceof Error) {
        toast({
          title: "Error",
          description: e.message,
          variant: "destructive",
        });
        return;
      } else {
        toast({
          title: "Error",
          description: "Something went wrong saving flow.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaveLoading(false);
    }
  }, [nodeConnection]);

  const onPublishWorkflow = useCallback(async () => {
    setIsPublishLoading(true);
    try {
      const response = await onWorkflowPublish(
        pathname.split("/").pop()!,
        true
      );

      if (!response) return;

      toast({
        title: "Success",
        description: response.message,
        variant: "success",
      });
    } catch (e) {
      if (e instanceof Error) {
        toast({
          title: "Error",
          description: e.message,
          variant: "destructive",
        });
        return;
      } else {
        toast({
          title: "Error",
          description: "Something went wrong publishing workflow.",
          variant: "destructive",
        });
      }
    } finally {
      setIsPublishLoading(false);
    }
  }, []);

  const onAutomateFlow = () => {
    const flows: string[] = [];
    const connectedEdges = edges.map((edge) => edge.target);
    connectedEdges.map((target) => {
      nodes.map((node) => {
        if (node.id === target) {
          flows.push(node.type!);
        }
      });
    });

    setIsFlow(flows);
  };

  useEffect(() => {
    onAutomateFlow();
  }, [edges]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 p-4">
        <Button
          onClick={onFlowAutomation}
          disabled={isFlow.length < 1 || isSaveLoading || isPublishLoading}
          className="cursor-pointer hover:opacity-80 flex items-center justify-center w-20"
        >
          {isSaveLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save"
          )}
        </Button>
        <Button
          disabled={isFlow.length < 1}
          onClick={onPublishWorkflow || isPublishLoading || isSaveLoading}
          className="cursor-pointer hover:opacity-80 w-20"
        >
          {isPublishLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Publish"
          )}
        </Button>
      </div>
      {children}
    </div>
  );
};

export default FlowInstance;
