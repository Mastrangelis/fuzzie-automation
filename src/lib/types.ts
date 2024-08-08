import { ConnectionProviderProps } from "@/providers/connections-provider";

export type SearchParamsProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

export type ConnectionTypes = "Google Drive" | "Notion" | "Slack" | "Discord";

export type Connection = {
  title: ConnectionTypes;
  description: string;
  image: string;
  connectionKey: keyof ConnectionProviderProps;
  accessTokenKey?: string;
  alwaysTrue?: boolean;
  slackSpecial?: boolean;
};

export type EditorCanvasTypes =
  | "Email"
  | "Condition"
  | "AI"
  | "Slack"
  | "Google Drive"
  | "Notion"
  | "Custom Webhook"
  | "Google Calendar"
  | "Trigger"
  | "Action"
  | "Wait";

export type EditorCanvasCardType = {
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  metadata: any;
  type: EditorCanvasTypes;
};

export type EditorNodeType = {
  id: string;
  type: EditorCanvasCardType["type"];
  position: {
    x: number;
    y: number;
  };
  data: EditorCanvasCardType;
};

export type EditorNode = EditorNodeType;

export type Edge = {
  id: string;
  source: string;
  target: string;
};

type LoadDataAction = {
  type: "LOAD_DATA";
  payload: {
    elements: EditorNode[];
    edges: Edge[];
  };
};

type UpdateNodeAction = {
  type: "UPDATE_NODE";
  payload: {
    elements: EditorNode[];
  };
};

type RedoAction = { type: "REDO" };
type UndoAction = { type: "UNDO" };

type SelectedElementAction = {
  type: "SELECTED_ELEMENT";
  payload: {
    element: EditorNode;
  };
};

export type EditorActions =
  | LoadDataAction
  | UpdateNodeAction
  | RedoAction
  | UndoAction
  | SelectedElementAction;

export const nodeMapper: Record<string, string> = {
  Notion: "notionNode",
  Slack: "slackNode",
  Discord: "discordNode",
  "Google Drive": "googleNode",
};
