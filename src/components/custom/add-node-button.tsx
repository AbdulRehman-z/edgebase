import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { NodeSelector } from "./node-selector";
import { TooltipWrapper } from "./tooltip-wrapper";

export const AddNodeButton = () => {
  const [openSelector, setOpenSelector] = useState(false);

  return (
    <TooltipWrapper content="Add node">
      <NodeSelector open={openSelector} onOpenChange={setOpenSelector}>
        <Button size={"icon-lg"} variant="secondary">
          <PlusIcon className="size-6" />
        </Button>
      </NodeSelector>
    </TooltipWrapper>
  );
};

AddNodeButton.displayName = "AddNodeButton";
