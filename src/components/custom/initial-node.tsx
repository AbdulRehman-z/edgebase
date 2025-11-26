import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { PlaceholderNode } from "../react-flow/placeholder-node";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";

export const InitialNode = memo((props: NodeProps) => {
  const [openSelector, setOpenSelector] = useState(false);

  return (
    <NodeSelector open={openSelector} onOpenChange={setOpenSelector}>
      <WorkflowNode
        showToolbar={false}
        name="Initial node"
        description="Click to add new node"
      >
        <PlaceholderNode {...props} onClick={() => setOpenSelector(true)}>
          <div className="flex items-center justify-center">
            <PlusIcon className="size-4" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
});

InitialNode.displayName = "InitialNode";
