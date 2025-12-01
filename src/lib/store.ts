import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import type { ReactFlowInstance } from "@xyflow/react";
import { create } from "zustand";

type EditorStore = {
  editor: ReactFlowInstance | null;
  setEditor: (instance: ReactFlowInstance | null) => void;
  theme: "dark" | "light" | "system";
  isResetStatus: boolean;
  resetStatus: (reset: boolean) => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  editor: null,
  setEditor: (instance) => set({ editor: instance }),
  theme: "system",
  isResetStatus: false,
  resetStatus: (reset) => set({ isResetStatus: reset }),
}));
