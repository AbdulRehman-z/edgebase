import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { BaseHandle } from "../react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "../react-flow/base-node";
import {
  NodeStatusIndicator,
  type NodeStatus,
} from "../react-flow/node-status-indicator";
import { WorkflowNode } from "./workflow-node";

type BaseExecutionNodeProps = NodeProps & {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
  children?: ReactNode;
};

export const BaseExecutionNode = ({
  id: nodeId,
  icon: Icon,
  name,
  status,
  description,
  onSettings,
  onDoubleClick,
  children,
}: BaseExecutionNodeProps) => {
  const { setNodes, setEdges } = useReactFlow();

  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    );
  };

  return (
    <WorkflowNode
      description={description}
      name={name}
      onDelete={handleDelete}
      onSettings={onSettings}
      showToolbar
    >
      <NodeStatusIndicator status={status}>
        <BaseNode onDoubleClick={onDoubleClick}>
          <BaseNodeContent>
            {typeof Icon === "string" ? (
              <Image src={Icon} alt={name} width={16} height={16} />
            ) : (
              <Icon className="size-4 text-muted-foreground" />
            )}
            {children}
            <BaseHandle position={Position.Left} type="target" id="target-1" />
            <BaseHandle position={Position.Right} type="source" id="source-1" />
          </BaseNodeContent>
        </BaseNode>
      </NodeStatusIndicator>
    </WorkflowNode>
  );
};

BaseExecutionNode.displayName = "BaseExecutionNode";
