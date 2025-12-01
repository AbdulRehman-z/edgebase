import type { Realtime } from "@inngest/realtime";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useEffect, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

type Props = {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
};

export const useNodeStatus = ({ channel, nodeId, refreshToken, topic }: Props) => {
  const [status, setStatus] = useState<NodeStatus>("initial");
  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  useEffect(() => {
    if (!data?.length) {
      return;
    }

    const lastMessage = data
      .filter(
        (message) =>
          message.channel === channel &&
          message.topic === topic &&
          message.kind === "data" &&
          message.data.nodeId === nodeId,
      )
      .sort((a, b) => {
        if (a.kind === "data" && b.kind === "data") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      })[0];

    if (lastMessage?.kind === "data") {
      if (isValidStatus(lastMessage.data.status)) {
        setStatus(lastMessage.data.status);
      }
    }
  }, [data, channel, nodeId, topic]);

  return status;
};

const isValidStatus = (status: unknown): status is NodeStatus => {
  return (
    typeof status === "string" &&
    ["loading", "success", "error", "initial"].includes(status)
  );
};
