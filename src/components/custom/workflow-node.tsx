import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";

type Props = {
  children: React.ReactNode;
  showToolbar?: boolean;
  onSettings?: () => void;
  onDelete?: () => void;
  name?: string;
  description?: string;
};

export const WorkflowNode = ({
  children,
  showToolbar,
  onSettings,
  onDelete,
  name,
  description,
}: Props) => {
  return (
    <>
      {showToolbar && (
        <NodeToolbar>
          <ButtonGroup>
            <Button variant="ghost" size="icon-sm" onClick={onSettings}>
              <SettingsIcon />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={onDelete}>
              <TrashIcon />
            </Button>
          </ButtonGroup>
        </NodeToolbar>
      )}
      {children}
      {name && (
        <NodeToolbar
          position={Position.Bottom}
          isVisible
          className="max-w-48 text-center text-sm"
        >
          <p className="font-medium">{name}</p>
          {description && (
            <p className="text-xs truncate text-muted-foreground">{description}</p>
          )}
        </NodeToolbar>
      )}
    </>
  );
};
