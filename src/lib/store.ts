import type { ReactFlowInstance } from "@xyflow/react";
import { create } from "zustand";

type EditorStore = {
  editor: ReactFlowInstance | null;
  setEditor: (instance: ReactFlowInstance | null) => void;
  theme: "dark" | "light" | "system";
};

export const useEditorStore = create<EditorStore>((set) => ({
  editor: null,
  setEditor: (instance) => set({ editor: instance }),
  theme: "system",
}));
