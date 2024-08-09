"use client";

import {
  editorReducer,
  EditorState,
  initialEditorState,
} from "@/lib/reducers/workflows-editor";
import { EditorActions } from "@/lib/types";
import { Dispatch, createContext, useContext, useReducer } from "react";

export type EditorContextData = {
  state: EditorState;
  dispatch: Dispatch<EditorActions>;
};

export const EditorContext = createContext<EditorContextData>(
  {} as EditorContextData
);

type EditorProps = {
  children: React.ReactNode;
};

const EditorProvider = (props: EditorProps) => {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState);

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor Hook must be used within the editor Provider");
  }
  return context;
};

export default EditorProvider;
