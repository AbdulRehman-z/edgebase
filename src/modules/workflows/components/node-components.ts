import type { NodeTypes } from "@xyflow/react";
import { InitialNode } from "@/components/custom/initial-node";
import { HttpRequestNode } from "@/components/custom/node-http";
import { ManualTriggerNode } from "@/components/custom/node-manual-trigger";
import { NodeTypesCustom } from "@/lib/types";

export const nodeComponents = {
  [NodeTypesCustom.INITIAL]: InitialNode,
  [NodeTypesCustom.HTTP_REQUEST]: HttpRequestNode,
  [NodeTypesCustom.MANUAL_TRIGGER]: ManualTriggerNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
