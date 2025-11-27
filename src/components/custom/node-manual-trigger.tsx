import type { NodeProps } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "./base-trigger-node";
import { ManualTriggerDialog } from "./manual-trigger-dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [openDialog, setDialogOpen] = useState(false);
  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <ManualTriggerDialog open={openDialog} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon={PlayIcon}
        status="initial"
        name="When clicking 'Execute Workflow'"
        onSettings={handleOpenSettings}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
