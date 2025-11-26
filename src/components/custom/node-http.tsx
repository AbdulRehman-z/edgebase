import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "./base-execution-node";
import { FormSchema, HttpTriggerDialog } from "./http-trigger-dialog";

type HttpRequestNodeData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
  [key: string]: unknown;
};

type HttpReqeustNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpReqeustNodeType>) => {
  const { setNodes } = useReactFlow();
  const [openDialog, setDialogOpen] = useState(false);
  const nodeData = props.data;
  const description = nodeData.endpoint
    ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
    : "Not configured";

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: FormSchema) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              endpoint: values.endpoint,
              method: values.method,
              body: values.body,
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
        defaultMethod={nodeData.method}
        defaultBody={nodeData.body}
        defaultEndpoint={nodeData.endpoint}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        onSettings={handleOpenDialog}
        onDoubleClick={handleOpenDialog}
      />
    </>
  );
});
