import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { TooltipWrapper } from "./tooltip-wrapper";

export const AddNodeButton = () => {
  return (
    <TooltipWrapper content="Add node">
      <Button onClick={() => {}} size={"icon-lg"} variant="outline">
        <PlusIcon className="size-6" />
      </Button>
    </TooltipWrapper>
  );
};

AddNodeButton.displayName = "AddNodeButton";
