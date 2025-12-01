import type { NodeProps } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { memo, useState } from "react";
import { fetchManualTriggerRealtimeToken } from "@/app/actions/manual-trigger-token";
import { useNodeStatus } from "@/hooks/use-node-status";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { BaseTriggerNode } from "./base-trigger-node";
import { ManualTriggerDialog } from "./manual-trigger-dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const status = useNodeStatus({
    channel: manualTriggerChannel().name,
    nodeId: props.id,
    refreshToken: fetchManualTriggerRealtimeToken,
    topic: "status",
  });
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
        status={status}
        name="When clicking 'Execute Workflow'"
        onSettings={handleOpenSettings}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
