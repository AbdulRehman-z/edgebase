import { type NodeType, NodeTypesCustom } from "@/lib/types";
import { httpTriggerExecutor } from "../triggers/http-trigger/executor";
import { manualTriggerExecutor } from "../triggers/manual-trigger/executor";
import type { NodeExecutor } from "./types";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeTypesCustom.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeTypesCustom.INITIAL]: manualTriggerExecutor, // just to avoid compiler errors
  [NodeTypesCustom.HTTP_REQUEST]: httpTriggerExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executor;
};
