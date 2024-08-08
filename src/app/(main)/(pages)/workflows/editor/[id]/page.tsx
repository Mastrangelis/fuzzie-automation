import WorfklowEditorCanvas from "@/components/reactflow/workflows/workflow-editor-canvas";
import { ConnectionsProvider } from "@/providers/connections-provider";
import EditorProvider from "@/providers/editor-provider";
import React from "react";

const WorkflowsEditorPage = () => {
  return (
    <div className="h-full">
      <EditorProvider>
        <ConnectionsProvider>
          <WorfklowEditorCanvas />
        </ConnectionsProvider>
      </EditorProvider>
    </div>
  );
};

export default WorkflowsEditorPage;
