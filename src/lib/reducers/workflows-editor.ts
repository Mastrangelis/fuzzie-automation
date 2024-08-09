import { EditorActions, EditorNode } from "../types";

export type Editor = {
  elements: EditorNode[];
  edges: {
    id: string;
    source: string;
    target: string;
  }[];
  selectedNode: EditorNode;
};

export type HistoryState = {
  history: Editor[];
  currentIndex: number;
};

export type EditorState = {
  editor: Editor;
  history: HistoryState;
};

const initialState: EditorState["editor"] = {
  elements: [],
  selectedNode: {
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
  edges: [],
};

const initialHistoryState: HistoryState = {
  history: [initialState],
  currentIndex: 0,
};

export const initialEditorState: EditorState = {
  editor: initialState,
  history: initialHistoryState,
};

export const editorReducer = (
  state: EditorState = initialEditorState,
  action: EditorActions
): EditorState => {
  switch (action.type) {
    case "REDO":
      if (state.history.currentIndex < state.history.history.length - 1) {
        const nextIndex = state.history.currentIndex + 1;
        const nextEditorState = { ...state.history.history[nextIndex] };
        const redoState = {
          ...state,
          editor: nextEditorState,
          history: {
            ...state.history,
            currentIndex: nextIndex,
          },
        };
        return redoState;
      }
      return state;

    case "UNDO":
      if (state.history.currentIndex > 0) {
        const prevIndex = state.history.currentIndex - 1;
        const prevEditorState = { ...state.history.history[prevIndex] };
        const undoState = {
          ...state,
          editor: prevEditorState,
          history: {
            ...state.history,
            currentIndex: prevIndex,
          },
        };
        return undoState;
      }
      return state;

    case "LOAD_DATA":
      return {
        ...state,
        editor: {
          ...state.editor,
          elements: action.payload.elements || initialState.elements,
          edges: action.payload.edges,
        },
      };
    case "SELECTED_ELEMENT":
      return {
        ...state,
        editor: {
          ...state.editor,
          selectedNode: action.payload.element,
        },
      };
    case "DELETE_ELEMENT":
      return {
        ...state,
        editor: {
          ...state.editor,
          edges: state.editor.edges.filter(
            (e) =>
              e.source !== action.payload.nodeId &&
              e.target !== action.payload.nodeId
          ),
          elements: state.editor.elements.filter(
            (n) => n.id !== action.payload.nodeId
          ),
        },
      };
    default:
      return state;
  }
};
