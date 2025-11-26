import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { BaseHandle } from "../react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "../react-flow/base-node";
import { WorkflowNode } from "./workflow-node";
import { NodeStatusIndicator, NodeStatus } from "../react-flow/node-status-indicator";

type BaseTriggerNodeProps = NodeProps & {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  status: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
  children?: ReactNode;
};

export const BaseTriggerNode = ({
  id: nodeId,
  icon: Icon,
  name,
  description,
  onSettings,
  status,
  onDoubleClick,
  children,
}: BaseTriggerNodeProps) => {
  const { setNodes, setEdges } = useReactFlow();

  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    );
  };

  return (
    <WorkflowNode
      showToolbar
      description={description}
      name={name}
      onDelete={handleDelete}
      onSettings={onSettings}
    >
      <NodeStatusIndicator status={status} className="rounded-l-2xl">
        <BaseNode
          status={status}
          onDoubleClick={onDoubleClick}
          className="relative rounded-l-2xl group"
        >
          <BaseNodeContent className="transition-all">
            {typeof Icon === "string" ? (
              <Image src={Icon} alt={name} width={16} height={16} />
            ) : (
              <Icon className="size-4 text-muted-foreground" />
            )}
            {children}
            <BaseHandle position={Position.Right} type="source" id="source-1" />
          </BaseNodeContent>
        </BaseNode>
      </NodeStatusIndicator>
    </WorkflowNode>
  );
};

BaseTriggerNode.displayName = "BaseTriggerNode";
