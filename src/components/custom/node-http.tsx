import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { fetchHttpRequestRealtimeToken } from "@/app/actions/http-request-token";
import { useNodeStatus } from "@/hooks/use-node-status";
import { HTTP_REQUEST_EXECUTION_CHANNEL } from "@/inngest/channels/http-requests";
import { BaseExecutionNode } from "./base-execution-node";
import { type HttpRequestFormType, HttpTriggerDialog } from "./http-trigger-dialog";

type HttpRequestNodeData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
  [key: string]: unknown;
};

type HttpReqeustNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpReqeustNodeType>) => {
  const status = useNodeStatus({
    channel: HTTP_REQUEST_EXECUTION_CHANNEL,
    nodeId: props.id,
    refreshToken: fetchHttpRequestRealtimeToken,
    topic: "status",
  });
  const { setNodes } = useReactFlow();
  const [openDialog, setDialogOpen] = useState(false);
  const nodeData = props.data;
  const description = nodeData.endpoint
    ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
    : "Not configured";

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: HttpRequestFormType) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }

        return node;
      }),
    );
    setDialogOpen(false);
  };

  return (
    <>
      <HttpTriggerDialog
        open={openDialog}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        status={status}
        name="HTTP Request"
        description={description}
        onSettings={handleOpenDialog}
        onDoubleClick={handleOpenDialog}
      />
    </>
  );
});
