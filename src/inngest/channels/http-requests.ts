import { channel, topic } from "@inngest/realtime";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

export const HTTP_REQUEST_EXECUTION_CHANNEL = "http-request-execution";

export const httpRequestChannel = channel(HTTP_REQUEST_EXECUTION_CHANNEL).addTopic(
  topic("status").type<{
    nodeId: string;
    status: Exclude<NodeStatus, "">;
  }>(),
);
