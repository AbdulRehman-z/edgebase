import type { NodeTypes } from "@xyflow/react";
import { InitialNode } from "@/components/custom/initial-node";
import { nodeTypeEnum } from "@/db/schemas/workflow-schema";

export const nodeComponents = {
  [nodeTypeEnum.enumValues[0]]: InitialNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
