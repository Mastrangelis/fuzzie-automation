import { EditorCanvasCardType } from "@/lib/types";
import { useEditor } from "@/providers/editor-provider";
import React, { useMemo } from "react";
import { Position, useNodeId } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import clsx from "clsx";
import EditorCanvasIconHelper from "@/components/icons/wofklows-editor-canvas-icon";
import CustomHandle from "@/components/reactflow/workflows/custom-handle";
import { DeleteIcon } from "lucide-react";

type Props = {
  data: EditorCanvasCardType;
  onNodeDelete: (nodeId: string) => void;
};

const EditorCanvasCardSingle = ({ data, onNodeDelete }: Props) => {
  const { dispatch, state } = useEditor();

  const nodeId = useNodeId();

  const logo = useMemo(() => {
    return <EditorCanvasIconHelper type={data.type} />;
  }, [data.type]);

  const onCardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    const val = state.editor.elements.find((n) => n.id === nodeId);

    if (val)
      dispatch({
        type: "SELECTED_ELEMENT",
        payload: {
          element: val,
        },
      });
  };

  const handleNodeDelete = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();

    onNodeDelete(nodeId!);
  };

  return (
    <>
      {data.type !== "Trigger" && data.type !== "Google Drive" && (
        <CustomHandle
          type="target"
          position={Position.Top}
          style={{ zIndex: 100 }}
        />
      )}
      <Card
        onClick={onCardClick}
        className="relative max-w-[400px] dark:border-muted-foreground/70"
      >
        <CardHeader className="flex flex-row items-center gap-4">
          <div>{logo}</div>
          <div>
            <CardTitle className="text-md">{data.title}</CardTitle>
            <CardDescription>
              <p className="text-xs text-muted-foreground/50">
                <b className="text-muted-foreground/80">ID: </b>
                {nodeId}
              </p>
              <p>{data.description}</p>
            </CardDescription>
          </div>
        </CardHeader>

        <Badge variant="secondary" className="absolute right-10 top-2">
          {data.type}
        </Badge>
        <DeleteIcon
          className="absolute right-2 top-2"
          onClick={handleNodeDelete}
        />
        <div
          className={clsx("absolute left-3 top-4 h-2 w-2 rounded-full", {
            "bg-green-500": Math.random() < 0.6,
            "bg-orange-500": Math.random() >= 0.6 && Math.random() < 0.8,
            "bg-red-500": Math.random() >= 0.8,
          })}
        />
      </Card>
      <CustomHandle type="source" position={Position.Bottom} id="a" />
    </>
  );
};

export default EditorCanvasCardSingle;
