import { channel, topic } from "@inngest/realtime";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

export const manualTriggerChannel = channel("manual-trigger-execution").addTopic(
  topic("status").type<{
    nodeId: string;
    status: Exclude<NodeStatus, "initial">;
  }>(),
);
